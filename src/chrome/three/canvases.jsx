/* Three.js canvases — React ports of the owner's 90s sections.
   Every canvas follows the same resilience contract as his main.js:
   init in try/catch, WebGL failure renders an offline fallback div
   ("[ 3D HERO OFFLINE ]" etc.) instead of a blank hole, and every
   useEffect cleans up fully (cancelAnimationFrame, dispose renderer +
   geometries, remove listeners) so page switches never leak or
   double-mount. Pixel ratio is capped at 2, particle counts drop on
   mobile, and an IntersectionObserver pauses offscreen loops. */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  applyStudioEnv,
  buildProceduralCar,
  makeDust,
  makeFloor,
  makeLightPool,
  makeRain,
  stepRain,
} from "./carBuilder";
import { engineUpdate } from "./audio";

/** Era variant from a car's year: pre-1950 = tall-grille vintage. */
const variantForYear = (year) => (year && year < 1950 ? "vintage" : "sleek");

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

function smooth(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Create a renderer in a container, or null when WebGL is unavailable. */
function createRenderer(container) {
  try {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    return renderer;
  } catch (e) {
    return null;
  }
}

function sizeRenderer(renderer, camera, container) {
  const w = container.clientWidth || 1;
  const h = container.clientHeight || 1;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function disposeScene(scene, renderer) {
  try {
    scene.traverse((child) => {
      if (child.isMesh) child.geometry?.dispose?.();
      if (child.isPoints || child.isLineSegments) child.geometry?.dispose?.();
      const mat = child.material;
      if (Array.isArray(mat)) mat.forEach((m) => m?.dispose?.());
      else mat?.dispose?.();
    });
    renderer.dispose();
    // Release the GL context immediately — without this, every page
    // switch leaks a live context until GC, and the browser's context
    // limit (~16) would eventually break new canvases.
    renderer.forceContextLoss();
    renderer.domElement?.parentNode?.removeChild(renderer.domElement);
  } catch (e) {
    // Cleanup must never throw.
  }
}

/**
 * Shared canvas shell: mounts the renderer, tracks visibility, and renders
 * the offline fallback when WebGL is unavailable.
 * `setup` receives { container, scene, camera, renderer, isMobile } and
 * returns { update(time, dt), dispose } — update runs only while visible.
 */
function ThreeShell({ testId, fallback, className, setup }) {
  const containerRef = useRef(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let cancelled = false;
    let raf = 0;
    let renderer = null;
    let scene = null;
    let extraDispose = null;
    let ro = null;
    let io = null;
    // Start hidden: the loop must not run (or start audio) before the
    // IntersectionObserver reports the canvas is actually on screen.
    let visible = false;
    let wasVisible = false;

    try {
      renderer = createRenderer(container);
      if (!renderer) {
        setOffline(true);
        container.dataset.webgl = "offline";
        return undefined;
      }
      container.dataset.webgl = "ok";
      scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / Math.max(1, container.clientHeight),
        0.1,
        400
      );
      sizeRenderer(renderer, camera, container);

      ro = new ResizeObserver(() => sizeRenderer(renderer, camera, container));
      ro.observe(container);
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            visible = e.isIntersecting;
          });
        },
        { rootMargin: "200px" }
      );
      io.observe(container);

      const api = setup({
        container,
        scene,
        camera,
        renderer,
        mobile: isMobile(),
        isVisible: () => visible,
      });
      extraDispose = api?.dispose || null;

      const clock = new THREE.Clock();
      let lastRender = 0;
      let elapsed = 0;
      const loop = () => {
        if (cancelled) return;
        raf = requestAnimationFrame(loop);
        // Visibility transitions get a hook (SpeedCanvas stops its
        // engine rev here — update() itself does not run offscreen).
        if (!visible && wasVisible) {
          try {
            api?.onHidden?.();
          } catch (e) {
            // Ignore.
          }
        }
        wasVisible = visible;
        if (!visible) return;
        // Cap at ~30fps: these are decorative canvases, and software
        // renderers (SwiftShader, low-end phones) saturate at 60fps.
        const now = performance.now();
        if (now - lastRender < 33) return;
        lastRender = now;
        // NOTE: never call clock.getElapsedTime() after getDelta() —
        // getElapsedTime() calls getDelta() internally, so the second
        // call returns ~0 and time freezes. Accumulate manually.
        const dt = Math.min(clock.getDelta(), 0.05);
        elapsed += dt;
        try {
          api?.update?.(elapsed, dt);
        } catch (e) {
          // One bad frame must not kill the loop.
        }
        renderer.render(scene, camera);
      };
      loop();
    } catch (e) {
      setOffline(true);
      container.dataset.webgl = "offline";
      if (renderer) disposeScene(scene || new THREE.Scene(), renderer);
      return undefined;
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      try {
        extraDispose?.();
      } catch (e) {
        // Ignore.
      }
      if (renderer && scene) disposeScene(scene, renderer);
    };
    // setup is a stable inline closure per canvas component (defined with
    // useCallback-free inline fn is NOT stable — so each canvas passes a
    // ref-stable setup via its own memoised function; see components).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid={testId}
      data-webgl={offline ? "offline" : "ok"}
      className={`ct-3d-wrap ${className || ""}`}
      aria-hidden="true"
    >
      {offline ? <div className="ct-3d-offline">{fallback}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HERO — cinematic swoop, gold dust, smoke, shimmer, rain            */
/* ------------------------------------------------------------------ */

export function HeroCanvas({ rainOn }) {
  const rainRef = useRef(rainOn);
  rainRef.current = rainOn;
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <ThreeShell
      testId="ct-3d-hero"
      fallback="[ 3D HERO OFFLINE ]"
      className="ct-3d-hero"
      setup={({ container, scene, camera, renderer, mobile }) => {
        scene.fog = new THREE.FogExp2(0x050508, 0.06);
        renderer.toneMappingExposure = 1.35;
        const cancelEnv = applyStudioEnv(scene, renderer, 0.85, "hero");
        camera.position.set(12, 6, 15);
        const startPos = camera.position.clone();
        // Front 3/4 is the money shot — never a dead rear or top-down.
        const endPos = new THREE.Vector3(
          mobile ? 7 : 6.8,
          mobile ? 2.2 : 1.9,
          mobile ? 6 : 5.2
        );

        const car = buildProceduralCar({ color: "#050508", accentColor: "#c9a84c", variant: "vintage" });
        scene.add(car.group);
        scene.add(makeFloor(80, 0x020202, 0.08));
        scene.add(makeLightPool(4.5));

        const dust = makeDust(mobile ? 150 : 400);
        scene.add(dust);

        const smokeGroup = new THREE.Group();
        smokeGroup.position.set(-2, 0.2, 0);
        const smokeMat = new THREE.MeshBasicMaterial({
          color: 0x111111,
          transparent: true,
          opacity: 0,
        });
        for (let i = 0; i < 8; i++) {
          const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), smokeMat);
          mesh.userData = { offset: i * Math.PI * 0.25, speed: 0.6 + Math.random() * 0.4 };
          smokeGroup.add(mesh);
        }
        scene.add(smokeGroup);

        scene.add(new THREE.AmbientLight(0x0a0a14, 0.2));
        const keyLight = new THREE.SpotLight(0xfff5e6, 0);
        keyLight.position.set(-3, 6, 3);
        keyLight.angle = Math.PI / 4.5;
        keyLight.penumbra = 1.0;
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0xd4af37, 0);
        rimLight.position.set(6, 3, -6);
        scene.add(rimLight);
        // Warm front fill from the camera side so the black body has an
        // edge to read against the dark floor.
        const fillLight = new THREE.DirectionalLight(0xfff5e6, 4);
        fillLight.position.set(4, 3, 8);
        scene.add(fillLight);
        // The dark studio env is what makes the body read black; the hero
        // is a wide shot, so boost the env so the chrome streaks read.
        scene.environmentIntensity = 1.6;
        const underglow = new THREE.PointLight(0x8b0000, 0, 8);
        underglow.position.set(0, 0.2, 0);
        scene.add(underglow);
        const shimmerLight = new THREE.PointLight(0xffffff, 0, 15);
        scene.add(shimmerLight);

        let rain = null;
        // Look slightly above the car so it sits in the lower third,
        // clear of the centered headline.
        const target = new THREE.Vector3(0, 0.95, 0);
        const swoopStart = performance.now();

        return {
          update(time) {
            // Cinematic swoop: high + far -> low + close over the first 4s,
            // then a slow orbit with mouse parallax (hero.js behaviour).
            const swoopT = smooth((performance.now() - swoopStart) / 4000);
            const mx = mouseRef.current.x * (mobile ? 0.5 : 1.5);
            const my = mouseRef.current.y * (mobile ? 0.2 : 0.5);
            const orbit = new THREE.Vector3(
              Math.sin(time * 0.08) * 5.5 + mx,
              1.2 + my + Math.sin(time * 0.2) * 0.2,
              Math.cos(time * 0.08) * 5.5 + my
            );
            const desired = endPos.clone().lerp(orbit, swoopT);
            const from = startPos.clone().lerp(endPos, swoopT);
            const goal = from.lerp(desired, swoopT);
            camera.position.lerp(goal, 0.03);
            camera.lookAt(target);

            keyLight.intensity += (8 - keyLight.intensity) * 0.01;
            rimLight.intensity += (9 - rimLight.intensity) * 0.01;
            underglow.intensity = 2 + Math.sin(time * 2) * 0.5;
            shimmerLight.intensity += (3 - shimmerLight.intensity) * 0.01;
            shimmerLight.position.set(
              Math.sin(time * 0.5) * 6,
              2,
              Math.cos(time * 0.3) * 6
            );

            const pos = dust.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
              pos[i] += 0.003;
              if (pos[i] > 8) pos[i] = 0;
            }
            dust.geometry.attributes.position.needsUpdate = true;
            dust.rotation.y = time * 0.02;

            smokeGroup.children.forEach((mesh) => {
              const data = mesh.userData;
              const t = (time * data.speed + data.offset) % (Math.PI * 2);
              const progress = t / (Math.PI * 2);
              mesh.position.x = -1.5 - progress * 3.5;
              mesh.position.y = 0.2 + progress * 1.5;
              mesh.position.z = Math.sin(t * 2) * progress * 0.8;
              mesh.scale.setScalar(1 + progress * 4);
              mesh.material.opacity = (1 - progress) * 0.25;
            });

            if (rainRef.current && !rain) {
              rain = makeRain(mobile ? 1200 : 2600);
              scene.add(rain);
            } else if (!rainRef.current && rain) {
              scene.remove(rain);
              rain.geometry.dispose();
              rain.material.dispose();
              rain = null;
            }
            if (rain) stepRain(rain);
          },
          dispose() {
            cancelEnv();
            car.dispose();
            if (rain) {
              rain.geometry.dispose();
              rain.material.dispose();
            }
          },
        };
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* GARAGE / SHOWROOM — drag-to-orbit, colour change, auto-rotate      */
/* ------------------------------------------------------------------ */

export function GarageCanvas({ car }) {
  const carRef = useRef(car);
  carRef.current = car;

  return (
    <ThreeShell
      testId="ct-3d-garage"
      fallback="[ SHOWROOM 3D OFFLINE ]"
      className="ct-3d-garage"
      setup={({ container, scene, camera, renderer }) => {
        scene.fog = new THREE.FogExp2(0x0a0a0c, 0.05);
        renderer.toneMappingExposure = 1.2;
        const cancelEnv = applyStudioEnv(scene, renderer, 0.85, "garage");
        // Front 3/4 default — the money shot, never the rear. Pulled
        // back so the whole car (scaled 1.25x) fits the stage.
        camera.position.set(7.6, 3.0, 6.6);
        camera.lookAt(0, 0.8, 0);

        const built = buildProceduralCar({
          color: carRef.current.color,
          accentColor: carRef.current.accentColor,
          variant: variantForYear(carRef.current.year),
        });
        built.group.scale.set(1.25, 1.25, 1.25);
        scene.add(built.group);
        scene.add(makeFloor(80, 0x010101, 0.15));
        scene.add(makeLightPool(5));

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const keyLight = new THREE.SpotLight(0xffffff, 4);
        keyLight.position.set(5, 8, 5);
        keyLight.angle = Math.PI / 4;
        keyLight.penumbra = 0.6;
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
        fillLight.position.set(-5, 4, -5);
        scene.add(fillLight);
        const moodLight = new THREE.PointLight(
          new THREE.Color(carRef.current.accentColor),
          2,
          20
        );
        // Low and BEHIND the car — its old spot (0, 1.5, 0) sat right
        // over the roof and dyed it gold-brown.
        moodLight.position.set(0, 0.5, -4);
        scene.add(moodLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.8, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        // Wheel must scroll the PAGE, not zoom the car — the Lenis fight
        // was one of the reported glitches.
        controls.enableZoom = false;
        controls.minDistance = 4;
        controls.maxDistance = 16;
        controls.minPolarAngle = 0.15;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        // Fit the whole car to the stage whatever its aspect is: the
        // stage used to stretch to ~640px tall (portrait), so the car
        // overflowed the frame even at a "pulled back" camera.
        const fitCamera = () => {
          const aspect = container.clientWidth / Math.max(1, container.clientHeight);
          const halfTan = Math.tan(THREE.MathUtils.degToRad(22.5));
          const d = Math.max(4.4, 3.6 / (halfTan * aspect));
          const dir = camera.position.clone().sub(controls.target).normalize();
          camera.position.copy(controls.target).addScaledVector(dir, d);
          controls.update();
        };
        fitCamera();
        const fitRO = new ResizeObserver(() => fitCamera());
        fitRO.observe(container);
        // Gentle sweep that NEVER reaches the rear: azimuth 0 = side
        // (+Z), PI/2 = front (+X). The auto-rotate ping-pongs between
        // front 3/4 and side 3/4 instead of spinning through the ugly
        // rear and sitting there.
        const AZ_MIN = 0.35;
        const AZ_MAX = 1.35;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.update();

        let resumeTimer = 0;
        const onStart = () => {
          controls.autoRotate = false;
          window.clearTimeout(resumeTimer);
          // Stop Lenis while dragging so the page does not scroll
          // under the user's finger.
          try {
            window.__lenis?.stop?.();
          } catch (e) {
            // Ignore.
          }
        };
        const onEnd = () => {
          try {
            window.__lenis?.start?.();
          } catch (e) {
            // Ignore.
          }
          resumeTimer = window.setTimeout(() => {
            controls.autoRotate = true;
          }, 3000);
        };
        controls.addEventListener("start", onStart);
        controls.addEventListener("end", onEnd);

        const targetBody = new THREE.Color(carRef.current.color);
        const targetAccent = new THREE.Color(carRef.current.accentColor);
        let spinTarget = built.group.rotation.y;
        let lastCarId = carRef.current.id;
        container.dataset.bodyColor = `#${targetBody.getHexString()}`;
        try {
          window.__ctGarage = {
            getAzimuth: () => controls.getAzimuthalAngle(),
            getBodyColor: () => `#${built.bodyMat.color.getHexString()}`,
            // Test hook: park the camera at an exact azimuth (radians;
            // 0 = side, PI/2 = front) for angle screenshots.
            setView: (az, polar = 1.15) => {
              controls.autoRotate = false;
              const r = camera.position.distanceTo(controls.target);
              camera.position.set(
                controls.target.x + r * Math.sin(polar) * Math.sin(az),
                controls.target.y + r * Math.cos(polar),
                controls.target.z + r * Math.sin(polar) * Math.cos(az)
              );
              controls.update();
            },
          };
        } catch (e) {
          // Ignore.
        }

        return {
          update() {
            const current = carRef.current;
            if (current.id !== lastCarId) {
              lastCarId = current.id;
              targetBody.set(current.color);
              targetAccent.set(current.accentColor);
              container.dataset.bodyColor = `#${targetBody.getHexString()}`;
              spinTarget = built.group.rotation.y + Math.PI;
            }
            built.bodyMat.color.lerp(targetBody, 0.06);
            built.accentMat.color.lerp(targetAccent, 0.06);
            moodLight.color.lerp(targetAccent, 0.06);
            built.group.rotation.y += (spinTarget - built.group.rotation.y) * 0.05;
            // Ping-pong the auto-rotate inside the front hemisphere.
            if (controls.autoRotate) {
              const az = controls.getAzimuthalAngle();
              if (az > AZ_MAX) controls.autoRotateSpeed = -0.8;
              else if (az < AZ_MIN) controls.autoRotateSpeed = 0.8;
            }
            controls.update();
          },
          dispose() {
            cancelEnv();
            fitRO.disconnect();
            window.clearTimeout(resumeTimer);
            controls.removeEventListener("start", onStart);
            controls.removeEventListener("end", onEnd);
            controls.dispose();
            built.dispose();
          },
        };
      }}
    />
  );
}

/* Per-part explode factor: parts fly out staggered (order 0 first),
   hold apart, then snap back in reverse order. p = section scroll 0..1.
   Windows are compressed so EVERY part is fully out during the hold
   (p 0.55–0.66) and fully home again by p 0.98. */
function partExplodeFactor(p, order, maxOrder) {
  const riseStart = 0.1 + order * 0.02;
  const rise = smooth((p - riseStart) / 0.25);
  const fallStart = 0.66 + (maxOrder - order) * 0.012;
  const fall = smooth((p - fallStart) / 0.2);
  return Math.min(1, Math.max(0, rise - fall));
}

const ANATOMY_LABELS = [
  { part: "body", anchor: [0, 0.9, 0], text: "Aerodynamic Monocoque", dx: -150, dy: -80 },
  { part: "cabin", anchor: [-0.5, 1.4, 0], text: "Swept Cabin", dx: 120, dy: -100 },
  { part: "engine", anchor: [0, 0.5, 0], text: "Straight-8 Supercharged", dx: 130, dy: -40 },
  { part: "interior", anchor: [-0.6, 1.0, 0], text: "Crimson Leather Cockpit", dx: -170, dy: -30 },
  { part: "grille", anchor: [2.4, 0.9, 0], text: "Iconic Chrome Grille", dx: 90, dy: 50 },
  { part: "flWheel", anchor: [0, 0.4, 0], text: "Wire-Spoke Alloy", dx: -30, dy: 100 },
];

export function AnatomyCanvas({ progress }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <ThreeShell
      testId="ct-3d-anatomy"
      fallback="[ ANATOMY 3D OFFLINE ]"
      className="ct-3d-anatomy"
      setup={({ container, scene, camera, renderer }) => {
        scene.fog = new THREE.FogExp2(0x020202, 0.05);
        renderer.toneMappingExposure = 1.2;
        const cancelEnv = applyStudioEnv(scene, renderer, 0.85, "anatomy");
        camera.position.set(8.5, 5, 10.5);
        const camStart = camera.position.clone();
        const camExploded = new THREE.Vector3(7.5, 4.2, 9.5);
        const camPush = new THREE.Vector3(7, 3.8, 8.5);

        const built = buildProceduralCar({ color: "#050508", accentColor: "#c9a84c", variant: "vintage" });
        scene.add(built.group);
        scene.add(makeFloor(100, 0x010101, 0.1));
        scene.add(makeLightPool(5));

        scene.add(new THREE.AmbientLight(0x0a0a0f, 0.5));
        const topSpot = new THREE.SpotLight(0xfff5e6, 8);
        topSpot.position.set(0, 10, 0);
        topSpot.angle = Math.PI / 3;
        topSpot.penumbra = 0.5;
        topSpot.castShadow = true;
        scene.add(topSpot);
        const goldRim = new THREE.DirectionalLight(0xd4af37, 2);
        goldRim.position.set(-6, 3, -6);
        scene.add(goldRim);
        // Front key so the exploded parts read from the camera side.
        const frontKey = new THREE.SpotLight(0xfff5e6, 4);
        frontKey.position.set(6, 6, 9);
        frontKey.angle = Math.PI / 3;
        frontKey.penumbra = 0.7;
        scene.add(frontKey);
        const flash = new THREE.PointLight(0xffffff, 0, 30);
        flash.position.set(0, 3, 0);
        scene.add(flash);

        const center = new THREE.Vector3(0, 0.8, 0);
        const maxOrder = Math.max(
          ...Object.values(built.parts).map((pt) => pt.userData.order || 0)
        );

        // Live-tracking labels + connector lines, overlaid on the frame
        // (the wrap's parent). Each label follows its part's projected
        // 3D position every frame; a line joins label to part.
        const frame = container.parentElement;
        const labelLayer = document.createElement("div");
        labelLayer.className = "ct-anatomy-labels";
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("class", "ct-anatomy-lines");
        labelLayer.appendChild(svg);
        const labelEls = ANATOMY_LABELS.map((lbl) => {
          const el = document.createElement("div");
          el.className = "ct-anatomy-3d-label";
          el.innerHTML = `<span class="ct-anatomy-3d-label-dot"></span><span class="ct-anatomy-3d-label-text">${lbl.text}</span>`;
          labelLayer.appendChild(el);
          const line = document.createElementNS(svgNS, "line");
          line.setAttribute("class", "ct-anatomy-line");
          svg.appendChild(line);
          const dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("r", "3.5");
          dot.setAttribute("class", "ct-anatomy-dot");
          svg.appendChild(dot);
          return { ...lbl, el, line, dot };
        });
        frame?.appendChild(labelLayer);

        let flashPeak = 0;
        let everExploded = false;
        const tmpV = new THREE.Vector3();

        try {
          window.__ctAnatomy = {
            getParts: () =>
              Object.entries(built.parts).map(([name, part]) => ({
                name,
                x: +part.position.x.toFixed(3),
                y: +part.position.y.toFixed(3),
                z: +part.position.z.toFixed(3),
                base: part.userData.base.toArray().map((v) => +v.toFixed(3)),
                offset: +part.position
                  .clone()
                  .sub(part.userData.base)
                  .length()
                  .toFixed(3),
              })),
            getFlashPeak: () => +flashPeak.toFixed(2),
            getProgress: () =>
              progressRef.current ? +progressRef.current.get().toFixed(3) : 0,
          };
        } catch (e) {
          // Ignore.
        }

        return {
          update() {
            const p = progressRef.current
              ? Math.min(1, Math.max(0, progressRef.current.get()))
              : 0;
            let overall = 0;
            Object.values(built.parts).forEach((part) => {
              const base = part.userData.base;
              const off = part.userData.explode;
              const rot = part.userData.explodeRot;
              if (!base || !off) return;
              const e = partExplodeFactor(p, part.userData.order || 0, maxOrder);
              overall = Math.max(overall, e);
              part.position.set(
                base.x + off.x * e,
                base.y + off.y * e,
                base.z + off.z * e
              );
              if (rot) part.rotation.set(rot.x * e, rot.y * e, rot.z * e);
            });
            if (overall > 0.5) everExploded = true;
            container.dataset.explode = overall.toFixed(2);
            container.dataset.progress = p.toFixed(2);
            container.dataset.assembled =
              everExploded && overall < 0.01 ? "1" : "0";
            // Whole exploded model rotates once while apart.
            built.group.rotation.y =
              Math.min(1, Math.max(0, (p - 0.42) / 0.3)) * Math.PI * 2;
            // Camera: wide on approach, closer on explode, subtle push-in
            // as the parts snap back together.
            const camTarget = new THREE.Vector3().lerpVectors(
              camStart,
              camExploded,
              overall
            );
            if (p > 0.85) camTarget.lerp(camPush, smooth((p - 0.85) / 0.15));
            camera.position.copy(camTarget);
            camera.lookAt(center);
            // Chrome flash as the parts snap back: peaks mid-snap.
            const flashNow =
              p > 0.78 && p < 0.98
                ? Math.sin(((p - 0.78) / 0.2) * Math.PI) * 8
                : 0;
            flash.intensity = flashNow;
            flashPeak = Math.max(flashPeak, flashNow);
            container.dataset.flashPeak = flashPeak.toFixed(2);

            // Labels track parts live; fade in with the explode, out
            // during the snap-back so the assembled car stands alone.
            const labelOpacity =
              Math.min(1, Math.max(0, (overall - 0.15) / 0.3)) *
              (1 - Math.min(1, Math.max(0, (p - 0.82) / 0.12)));
            const w = container.clientWidth || 1;
            const h = container.clientHeight || 1;
            svg.setAttribute("width", String(w));
            svg.setAttribute("height", String(h));
            // Project every label first, then de-collide: as the exploded
            // model rotates, two anchors can project to the same screen
            // spot and their labels would stack on each other. Sort by y
            // and enforce a minimum vertical gap before placing them.
            const placed = [];
            labelEls.forEach((lbl) => {
              const part = built.parts[lbl.part];
              if (!part) return;
              tmpV.set(...lbl.anchor);
              part.localToWorld(tmpV);
              tmpV.project(camera);
              const behind = tmpV.z > 1;
              const px = (tmpV.x * 0.5 + 0.5) * w;
              const py = (-tmpV.y * 0.5 + 0.5) * h;
              const lx = Math.min(
                Math.max(8, px + lbl.dx),
                w - 190
              );
              const ly = Math.min(Math.max(8, py + lbl.dy), h - 40);
              placed.push({ lbl, behind, px, py, lx, ly });
            });
            placed.sort((a, b) => a.ly - b.ly);
            for (let i = 1; i < placed.length; i++) {
              if (placed[i].ly < placed[i - 1].ly + 38) {
                placed[i].ly = Math.min(placed[i - 1].ly + 38, h - 40);
              }
            }
            placed.forEach(({ lbl, behind, px, py, lx, ly }) => {
              lbl.el.style.opacity = behind ? "0" : String(labelOpacity);
              lbl.el.style.visibility =
                behind || labelOpacity < 0.02 ? "hidden" : "visible";
              lbl.el.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px)`;
              const cx = lx + 70;
              const cy = ly + 14;
              lbl.line.setAttribute("x1", String(cx));
              lbl.line.setAttribute("y1", String(cy));
              lbl.line.setAttribute("x2", String(px.toFixed(1)));
              lbl.line.setAttribute("y2", String(py.toFixed(1)));
              lbl.line.setAttribute("opacity", String(labelOpacity));
              lbl.dot.setAttribute("cx", String(px.toFixed(1)));
              lbl.dot.setAttribute("cy", String(py.toFixed(1)));
              lbl.dot.setAttribute("opacity", String(labelOpacity));
            });
          },
          dispose() {
            cancelEnv();
            labelLayer.remove();
            built.dispose();
          },
        };
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SPEED — rear view, rushing road, tail-light glow, engine rev       */
/* ------------------------------------------------------------------ */

export function SpeedCanvas({ progress, soundOn }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  return (
    <ThreeShell
      testId="ct-3d-speed"
      fallback="[ SPEED 3D OFFLINE ]"
      className="ct-3d-speed"
      setup={({ container, scene, camera, renderer, mobile, isVisible }) => {
        scene.fog = new THREE.FogExp2(0x020202, 0.04);
        renderer.toneMappingExposure = 1.2;
        const cancelEnv = applyStudioEnv(scene, renderer, 0.6, "speed");
        camera.position.set(0, 3.0, 7);
        const baseCam = new THREE.Vector3(0, 3.0, 7);

        const built = buildProceduralCar({ color: "#050508", accentColor: "#c9a84c", variant: "vintage" });
        built.group.rotation.y = Math.PI / 2;
        scene.add(built.group);

        const floor = new THREE.Mesh(
          new THREE.PlaneGeometry(40, 400),
          new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 0.9 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.z = -150;
        scene.add(floor);

        const lineGeo = new THREE.PlaneGeometry(0.15, 3);
        const lineMat = new THREE.MeshBasicMaterial({
          color: 0xd4af37,
          transparent: true,
          opacity: 0.4,
        });
        const lines = [];
        for (let i = 0; i < 30; i++) {
          const line = new THREE.Mesh(lineGeo, lineMat);
          line.rotation.x = -Math.PI / 2;
          line.position.set(0, 0.01, -i * 8);
          scene.add(line);
          lines.push(line);
        }

        const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
        const poleMat = new THREE.MeshStandardMaterial({
          color: 0x111111,
          metalness: 0.5,
          roughness: 0.8,
        });
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffddaa });
        const poles = [];
        for (let i = 0; i < 40; i++) {
          const grp = new THREE.Group();
          const pole = new THREE.Mesh(poleGeo, poleMat);
          pole.position.y = 3;
          grp.add(pole);
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), bulbMat);
          bulb.position.y = 6;
          grp.add(bulb);
          grp.position.set(i % 2 === 0 ? 5 : -5, 0, -i * 12);
          scene.add(grp);
          poles.push(grp);
        }

        const particleCount = mobile ? 300 : 800;
        const particleGeo = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 3 + Math.random() * 10;
          posArray[i] = Math.cos(angle) * radius;
          posArray[i + 1] = Math.sin(angle) * radius + 2;
          posArray[i + 2] = (Math.random() - 0.5) * 200 - 50;
        }
        particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        const particles = new THREE.Points(
          particleGeo,
          new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
            transparent: true,
            opacity: 0.4,
          })
        );
        scene.add(particles);

        scene.add(new THREE.AmbientLight(0x050505));
        const tailGlow = new THREE.PointLight(0xff0000, 5, 8);
        tailGlow.position.set(0, 0.6, 2.5);
        scene.add(tailGlow);
        // Warm rear fill so the black rear body reads against the road.
        const rearFill = new THREE.PointLight(0xffddaa, 2, 14);
        rearFill.position.set(0, 3, 5);
        scene.add(rearFill);
        const fillLight = new THREE.DirectionalLight(0xffaa88, 1.5);
        fillLight.position.set(5, 10, 5);
        scene.add(fillLight);

        return {
          update(time) {
            const p = progressRef.current
              ? Math.min(1, Math.max(0, progressRef.current.get()))
              : 0;
            // speed.js physics proxy: velocity 0.1 -> 5, FOV 45 -> 90.
            const velocity = 0.1 + p * 4.9;
            const fov = 45 + p * 45;
            container.dataset.velocity = velocity.toFixed(2);
            container.dataset.progress = p.toFixed(2);
            if (camera.fov !== fov) {
              camera.fov = fov;
              camera.updateProjectionMatrix();
            }
            const shake = Math.max(0, (velocity - 0.2) * 0.04);
            camera.position.x = baseCam.x + (Math.random() - 0.5) * shake;
            camera.position.y = baseCam.y + (Math.random() - 0.5) * shake;
            camera.lookAt(0, 0.8, -10);

            lines.forEach((line) => {
              line.position.z += velocity;
              if (line.position.z > 10) line.position.z -= 240;
            });
            poles.forEach((pole) => {
              pole.position.z += velocity;
              if (pole.position.z > 10) pole.position.z -= 480;
            });
            const pos = particles.geometry.attributes.position.array;
            for (let i = 2; i < particleCount * 3; i += 3) {
              pos[i] += velocity * 3;
              if (pos[i] > 10) pos[i] -= 250;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            built.group.position.y = Math.sin(time * 25) * (shake * 0.6);
            built.group.rotation.z = Math.sin(time * 2) * 0.02;
            built.tailMat.emissiveIntensity = 2 + Math.sin(time * 6) * 0.8;

            engineUpdate(soundRef.current && isVisible(), p);
          },
          onHidden() {
            engineUpdate(false, 0);
          },
          dispose() {
            cancelEnv();
            engineUpdate(false, 0);
            built.dispose();
          },
        };
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* OUTRO — dense fog, headlights on, slow camera push-in              */
/* ------------------------------------------------------------------ */

export function OutroCanvas({ progress }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <ThreeShell
      testId="ct-3d-outro"
      fallback="[ OUTRO 3D OFFLINE ]"
      className="ct-3d-outro"
      setup={({ container, scene, camera, renderer }) => {
        scene.fog = new THREE.FogExp2(0x010101, 0.08);
        const cancelEnv = applyStudioEnv(scene, renderer, 0.6, "outro");
        camera.position.set(2, 3.5, 14);
        camera.lookAt(0, 0.8, -2);

        const built = buildProceduralCar({ color: "#050508", accentColor: "#c9a84c", variant: "vintage" });
        built.lampMat.emissiveIntensity = 5;
        // FRONT toward the camera: rotation.y = -PI/2 maps local +X
        // (the grille/headlights) to world +Z. Round 2 used +PI/2, which
        // faced the car AWAY — the headlights were invisible from the
        // camera and the spots shone from the wrong end.
        built.group.rotation.y = -Math.PI / 2;
        built.group.position.set(0, 0, -2);
        scene.add(built.group);
        scene.add(makeFloor(100, 0x000000, 0.1));
        scene.add(makeLightPool(5));

        const lSpot = new THREE.SpotLight(0xfff5e6, 3, 50, Math.PI / 5, 1.0, 1);
        lSpot.position.set(-0.6, 0.6, 0.3);
        const lTarget = new THREE.Object3D();
        lTarget.position.set(-0.6, 0.6, 20);
        scene.add(lTarget);
        lSpot.target = lTarget;
        scene.add(lSpot);
        const rSpot = new THREE.SpotLight(0xfff5e6, 3, 50, Math.PI / 5, 1.0, 1);
        rSpot.position.set(0.6, 0.6, 0.3);
        const rTarget = new THREE.Object3D();
        rTarget.position.set(0.6, 0.6, 20);
        scene.add(rTarget);
        rSpot.target = rTarget;
        scene.add(rSpot);

        const topSpot = new THREE.SpotLight(0xffffff, 1);
        topSpot.position.set(0, 10, -2);
        topSpot.angle = Math.PI / 3;
        topSpot.penumbra = 1;
        scene.add(topSpot);
        scene.add(new THREE.AmbientLight(0x020202));

        const target = new THREE.Vector3(0, 0.8, -2);

        return {
          update(time) {
            const p = progressRef.current
              ? Math.min(1, Math.max(0, progressRef.current.get()))
              : 0;
            // Slow push-in as the outro scrolls into view (outro.js pulls
            // the camera back on scroll; here the section is short, so the
            // same travel runs forward into the fog).
            camera.position.set(2 * (1 - p), 3.5 - p * 2.3, 14 - p * 10);
            container.dataset.cameraZ = camera.position.z.toFixed(2);
            target.x = Math.sin(time * 0.4) * 0.4;
            target.y = 0.8 + Math.cos(time * 0.3) * 0.1;
            camera.lookAt(target);
            const flicker = 3 + Math.random() * 0.3;
            lSpot.intensity = flicker;
            rSpot.intensity = flicker;
          },
          dispose() {
            cancelEnv();
            built.dispose();
          },
        };
      }}
    />
  );
}
