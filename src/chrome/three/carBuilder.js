/* Shared procedural car builder — ROUND 3 rebuild.
   The round-2 capsule body read as a toy submarine (the garage rear
   screenshot proved it). A capsule can never look like a 1930s–60s
   classic car, so the car is now built the way coachbuilders do it:
   a SIDE-PROFILE silhouette (THREE.Shape) extruded with a bevel for
   the body shell, separate extruded pontoon fenders with real arch
   gaps, running boards, chrome bumpers, glass, whitewall wire wheels
   and a hood ornament. Two era variants: 'vintage' (pre-1950, tall
   grille, freestanding lamps) and 'sleek' (1950s+, lower roofline,
   low wide grille, integrated lamps).

   Axes: X = length (front +X), Y = up, Z = width. Ground is y = 0.
   Wheels: outer radius 0.42, front axle x = +1.35, rear x = -1.25,
   track z = +/-0.80. */

import * as THREE from "three";

export function chromeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.08,
    envMapIntensity: 1.6,
  });
}

export function tireMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.92 });
}

/* ------------------------------------------------------------------ */
/* Studio environment                                                  */
/* ------------------------------------------------------------------ */

/** Painted studio gradient (CPU image, shareable across GL contexts).
    Kept as the fallback when the PMREM bake is unavailable. Brighter
    and higher-contrast than the round-2 version: big softbox strips
    so the black clearcoat has long highlights to catch. */
let studioEnvTexture = null;
function makeStudioEnvTexture() {
  if (studioEnvTexture) return studioEnvTexture;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#111010";
  g.fillRect(0, 0, 1024, 512);
  // Ceiling softboxes — the long highlights on the bonnet + roof
  const key = g.createLinearGradient(0, 0, 0, 130);
  key.addColorStop(0, "rgba(255,246,230,1)");
  key.addColorStop(1, "rgba(255,246,230,0)");
  g.fillStyle = key;
  g.fillRect(180, 0, 300, 130);
  g.fillRect(560, 0, 300, 130);
  // Gold rim strip (warm side glow)
  g.fillStyle = "rgba(212,175,55,0.95)";
  g.fillRect(0, 200, 1024, 16);
  g.fillStyle = "rgba(212,175,55,0.4)";
  g.fillRect(0, 216, 1024, 50);
  // Cool side strips
  g.fillStyle = "rgba(225,232,240,0.7)";
  g.fillRect(0, 80, 26, 240);
  g.fillRect(998, 80, 26, 240);
  // Warm floor bounce
  const floor = g.createLinearGradient(0, 400, 0, 512);
  floor.addColorStop(0, "rgba(139,0,0,0)");
  floor.addColorStop(1, "rgba(255,130,70,0.55)");
  g.fillStyle = floor;
  g.fillRect(0, 400, 1024, 112);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  studioEnvTexture = tex;
  return tex;
}

/**
 * PMREM studio environment, baked once per GL context (a PMREM texture
 * is GPU-resident in the context that baked it, so it cannot be shared
 * across canvases — per-canvas bake is the standard three.js pattern
 * and costs <0.5s on a real GPU; SwiftShader is slow, which is why
 * the painted texture below exists as a fallback). The env scene is a
 * DARK studio: black walls with a few bright softbox panels, so a
 * near-black clearcoat body reads as glossy black with long gold and
 * white streaks instead of the uniform grey wash a bright RoomEnvironment
 * gives it. Cached per renderer so StrictMode remounts of the same
 * renderer never re-bake.
 */
const pmremCache = new WeakMap();
function makeStudioEnvScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const panel = (w, h, hex, boost, pos, rot) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(hex).multiplyScalar(boost),
        side: THREE.DoubleSide,
      })
    );
    m.position.set(...pos);
    m.rotation.set(...rot);
    scene.add(m);
    return m;
  };
  // Ceiling softboxes — the long highlights on bonnet + roof.
  // NEUTRAL white: the first version used warm-white panels and the
  // car came out maroon — a near-black clearcoat body multiplies
  // every warm tint in the env into a brown/red cast.
  panel(7, 3.5, 0xffffff, 8, [0, 6, 1.5], [Math.PI / 2, 0, 0]);
  panel(7, 3.5, 0xffffff, 8, [0, 6, -1.5], [Math.PI / 2, 0, 0]);
  // Gold rim strip — kept subtle so it streaks, never dyes.
  panel(10, 0.9, 0xd4af37, 1.5, [-7, 2.5, 0], [0, Math.PI / 2, 0]);
  // Cool strip on the opposite side.
  panel(10, 0.9, 0xdfe8f2, 4, [7, 2.5, 0], [0, -Math.PI / 2, 0]);
  // Neutral front wash.
  panel(8, 2, 0xffffff, 0.8, [0, 2, 8], [0, Math.PI, 0]);
  // Neutral floor bounce — subtle, not a floodlight.
  panel(8, 5, 0xffffff, 0.3, [0, 0.05, 0], [-Math.PI / 2, 0, 0]);
  return scene;
}

function getPmremEnv(renderer) {
  if (pmremCache.has(renderer)) return pmremCache.get(renderer);
  let tex = null;
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    tex = pmrem.fromScene(makeStudioEnvScene(), 0.04).texture;
    pmrem.dispose();
  } catch (e) {
    tex = null;
  }
  pmremCache.set(renderer, tex);
  return tex;
}

export function applyStudioEnv(scene, renderer, intensity = 0.85) {
  try {
    const tex = getPmremEnv(renderer) || makeStudioEnvTexture();
    scene.environment = tex;
    scene.environmentIntensity = intensity;
  } catch (e) {
    // No environment — the direct lights still carry the scene.
  }
  return () => {};
}

export function makeFloor(size = 90, color = 0x020202, roughness = 0.12) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.85,
      envMapIntensity: 0.25,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
}

/** Warm radial light pool under the car so it sits in a spotlight. */
export function makeLightPool(radius = 5.5) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(255,232,196,0.15)");
  grad.addColorStop(0.45, "rgba(212,175,55,0.06)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 48),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.012;
  return mesh;
}

/* ------------------------------------------------------------------ */
/* Wheels — whitewall wire wheels                                      */
/* ------------------------------------------------------------------ */

function makeWheel(tireMat, hubMat) {
  // Wheel plane is XY, axle along Z. rotation.z spins it.
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.12, 16, 64), tireMat);
  tire.castShadow = true;
  wheel.add(tire);
  // Whitewall rings on both faces (the inner one is hidden by the body).
  const wallGeo = new THREE.TorusGeometry(0.26, 0.035, 10, 48);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf2ede2,
    roughness: 0.55,
    metalness: 0.0,
  });
  [0.095, -0.095].forEach((z) => {
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.z = z;
    wheel.add(wall);
  });
  // Chrome rim ring the spokes anchor to.
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.26, 0.018, 8, 48),
    chromeMaterial()
  );
  wheel.add(rim);
  // Gold hub + cap.
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.18, 24),
    hubMat
  );
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 12),
    chromeMaterial()
  );
  cap.position.z = 0.1;
  wheel.add(cap);
  // 12 thin wire spokes in the XY plane.
  const spokeGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.5, 6);
  const spokeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8e0,
    metalness: 1.0,
    roughness: 0.15,
  });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const spoke = new THREE.Mesh(spokeGeo, spokeMat);
    spoke.position.set(Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0);
    spoke.rotation.z = a - Math.PI / 2;
    wheel.add(spoke);
  }
  wheel.userData.spokeMat = spokeMat;
  wheel.userData.wallMat = wallMat;
  return wheel;
}

/* ------------------------------------------------------------------ */
/* Profile shapes — the silhouette is 80% of "real"                   */
/* ------------------------------------------------------------------ */

function profileShape(points, closeBottom = true) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.length === 5 && p[0] === "q") {
      s.quadraticCurveTo(p[1], p[2], p[3], p[4]);
    } else {
      s.lineTo(p[0], p[1]);
    }
  }
  if (closeBottom) s.closePath();
  return s;
}

function extrude(shape, depth, bevel = 0.06, bevelSegments = 3) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments,
    curveSegments: 24,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

/** Annular arch band around a wheel centre — a real pontoon fender. */
function archBandShape(cx, cy, rOut, rIn, a0 = 0.06, a1 = Math.PI - 0.06) {
  const s = new THREE.Shape();
  s.absarc(cx, cy, rOut, a0, a1, false);
  s.absarc(cx, cy, rIn, a1, a0, true);
  s.closePath();
  return s;
}

const PROFILES = {
  vintage: {
    body: [
      [-2.32, 0.38],
      ["q", -2.42, 0.55, -2.38, 0.72],
      [-2.36, 0.88],
      [-2.05, 0.99],
      [-1.45, 1.01],
      [0.45, 1.01],
      [0.6, 0.97],
      [2.02, 0.9],
      [2.2, 0.86],
      [2.28, 0.6],
      [2.28, 0.38],
    ],
    bodyDepth: 1.15,
    bodyBevel: 0.09,
    cabin: [
      [-1.42, 1.0],
      [-1.38, 1.26],
      ["q", -1.3, 1.4, -1.12, 1.42],
      [-0.2, 1.46],
      [0.18, 1.4],
      [0.52, 1.0],
    ],
    cabinDepth: 0.88,
    cabinBevel: 0.09,
    hoodTop: 1.06,
    hoodFront: 2.14,
    hoodRear: 0.55,
    grilleTall: true,
    fenderROut: 0.58,
    fenderRIn: 0.45,
    fenderZ: 0.8,
    fenderDepth: 0.2,
    lampY: 0.82,
    lampX: 2.02,
    lampStalk: true,
    beltY: 1.01,
  },
  sleek: {
    body: [
      [-2.3, 0.34],
      ["q", -2.4, 0.5, -2.36, 0.68],
      [-2.34, 0.8],
      [-2.0, 0.88],
      [-1.4, 0.9],
      [0.45, 0.9],
      [0.6, 0.86],
      [2.05, 0.8],
      [2.22, 0.76],
      [2.28, 0.52],
      [2.28, 0.34],
    ],
    bodyDepth: 1.25,
    bodyBevel: 0.08,
    cabin: [
      [-1.35, 0.88],
      [-1.3, 1.12],
      ["q", -1.22, 1.24, -1.05, 1.26],
      [-0.15, 1.28],
      [0.15, 1.22],
      [0.5, 0.88],
    ],
    cabinDepth: 0.96,
    cabinBevel: 0.08,
    hoodTop: 0.94,
    hoodFront: 2.14,
    hoodRear: 0.55,
    grilleTall: false,
    fenderROut: 0.54,
    fenderRIn: 0.44,
    fenderZ: 0.78,
    fenderDepth: 0.18,
    lampY: 0.68,
    lampX: 2.1,
    lampStalk: false,
    beltY: 0.9,
  },
};

/**
 * Build the procedural car.
 * @param {{ color?: string, accentColor?: string, variant?: 'vintage'|'sleek' }} opts
 * @returns {{ group, bodyMat, accentMat, lampMat, tailMat, parts, wheels,
 *   headlights, tailLights, dispose }}
 * parts.* groups carry `userData.base` (assembled position) and
 * `userData.explode` (offset at full explode) for the Anatomy canvas.
 */
export function buildProceduralCar({
  color = "#050508",
  accentColor = "#c9a84c",
  variant = "vintage",
} = {}) {
  const P = PROFILES[variant] || PROFILES.vintage;
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.9,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 0.9,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    metalness: 0.9,
    roughness: 0.12,
    envMapIntensity: 1.2,
  });
  const chromeMat = chromeMaterial();
  const tireMat = tireMaterial();
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff5e6,
    emissiveIntensity: 2,
  });
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 2,
  });
  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.9,
    roughness: 0.6,
  });
  const interiorMat = new THREE.MeshStandardMaterial({
    color: 0x5a1818,
    roughness: 0.8,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fc4d8,
    metalness: 0.9,
    roughness: 0.06,
    transparent: true,
    opacity: 0.55,
    envMapIntensity: 2.0,
    side: THREE.DoubleSide,
  });
  const darkLineMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.6,
  });

  const group = new THREE.Group();
  const parts = {};
  const tag = (grp, base, explode, rot = [0, 0, 0], order = 0) => {
    grp.userData.base = new THREE.Vector3(...base);
    grp.userData.explode = new THREE.Vector3(...explode);
    grp.userData.explodeRot = new THREE.Vector3(...rot);
    grp.userData.order = order;
    grp.position.copy(grp.userData.base);
    return grp;
  };
  const halfBody = P.bodyDepth / 2 + P.bodyBevel;

  // 1. Body shell — extruded side profile with bevel. This IS the car.
  parts.body = tag(new THREE.Group(), [0, 0, 0], [0, 2.0, 0], [0, 0, 0], 6);
  const bodyMesh = new THREE.Mesh(
    extrude(profileShape(P.body), P.bodyDepth, P.bodyBevel),
    bodyMat
  );
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  parts.body.add(bodyMesh);
  // Chrome beltline trim + door shut lines + handles (proud of the
  // surface by 0.004 so they never z-fight the body).
  [-1, 1].forEach((side) => {
    const z = side * (halfBody + 0.004);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.025, 0.012), chromeMat);
    trim.position.set(-0.4, P.beltY, z);
    parts.body.add(trim);
    [-0.85, 0.38].forEach((x) => {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.42, 0.008), darkLineMat);
      line.position.set(x, P.beltY - 0.28, z);
      parts.body.add(line);
    });
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.015), chromeMat);
    handle.position.set(-0.15, P.beltY - 0.15, z);
    parts.body.add(handle);
  });
  // Chrome bumpers, front + rear — curved tubes bowed outward.
  const bumper = (front) => {
    const sgn = front ? 1 : -1;
    const x0 = front ? 2.3 : -2.32;
    const x1 = front ? 2.48 : -2.5;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x0, 0.42, -0.62),
      new THREE.Vector3(x1, 0.42, 0),
      new THREE.Vector3(x0, 0.42, 0.62)
    );
    const bar = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.045, 10, false), chromeMat);
    bar.castShadow = true;
    parts.body.add(bar);
    [-0.3, 0.3].forEach((z) => {
      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.05), chromeMat);
      guard.position.set(sgn > 0 ? 2.42 : -2.44, 0.44, z);
      parts.body.add(guard);
    });
  };
  bumper(true);
  bumper(false);
  group.add(parts.body);

  // 2. Cabin — extruded roofline profile + glass. Lifts off the shell.
  parts.cabin = tag(new THREE.Group(), [0, 0, 0], [-0.6, 2.4, 0], [-0.12, 0, 0], 4);
  const cabinMesh = new THREE.Mesh(
    extrude(profileShape(P.cabin), P.cabinDepth, P.cabinBevel),
    bodyMat
  );
  cabinMesh.castShadow = true;
  parts.cabin.add(cabinMesh);
  // Windscreen — angled glass plane from roof front down to the cowl.
  // rotation.z is POSITIVE: the box's local Y axis must point up-BACK
  // (from cowl 0.52,1.00 to roof 0.18,1.40). Round 3 v1 used -0.72,
  // which leaned the glass forward so it poked above the roofline.
  const shield = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.82), glassMat);
  shield.position.set(0.35, 1.17, 0);
  shield.rotation.z = 0.7;
  parts.cabin.add(shield);
  // Side windows.
  [-1, 1].forEach((side) => {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.3, 0.015),
      glassMat
    );
    win.position.set(-0.55, 1.24, side * (P.cabinDepth / 2 + P.cabinBevel + 0.002));
    parts.cabin.add(win);
  });
  group.add(parts.cabin);

  // 3. Hood — thin bonnet panel following the bonnet line; lifts first.
  parts.hood = tag(new THREE.Group(), [0, 0, 0], [1.4, 1.8, 0], [0, 0, -0.18], 0);
  const hoodShape = profileShape([
    [P.hoodRear, P.hoodTop - 0.06],
    [P.hoodFront, P.hoodTop - 0.14],
    [P.hoodFront, P.hoodTop - 0.06],
    [P.hoodRear, P.hoodTop + 0.02],
  ]);
  const hoodPanel = new THREE.Mesh(extrude(hoodShape, 0.88, 0.02), bodyMat);
  hoodPanel.castShadow = true;
  parts.hood.add(hoodPanel);
  const hoodSpine = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.1), chromeMat);
  hoodSpine.position.set(1.35, P.hoodTop + 0.03, 0);
  parts.hood.add(hoodSpine);
  // Hood side louvers — short chrome slits.
  [-1, 1].forEach((side) => {
    for (let i = 0; i < 4; i++) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.015, 0.01), chromeMat);
      louver.position.set(1.15 + i * 0.22, P.hoodTop - 0.05, side * 0.46);
      parts.hood.add(louver);
    }
  });
  group.add(parts.hood);

  // 4. Grille — tall chrome frame + slats + hood ornament (vintage),
  //    or a low wide bar (sleek).
  parts.grille = tag(new THREE.Group(), [0, 0, 0], [2.2, 0.6, 0], [0, 0.25, 0], 1);
  if (P.grilleTall) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.58, 0.46), chromeMat);
    frame.position.set(2.3, 0.62, 0);
    frame.castShadow = true;
    parts.grille.add(frame);
    for (let i = -2; i <= 2; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.03), darkLineMat);
      slat.position.set(2.36, 0.62, i * 0.08);
      parts.grille.add(slat);
    }
    // Hood ornament — chrome stem + figure.
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), chromeMat);
    stem.position.set(2.3, 0.98, 0);
    parts.grille.add(stem);
    const figure = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), chromeMat);
    figure.scale.set(1, 1.8, 1);
    figure.position.set(2.3, 1.06, 0);
    parts.grille.add(figure);
  } else {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.95), chromeMat);
    bar.position.set(2.28, 0.55, 0);
    bar.castShadow = true;
    parts.grille.add(bar);
    for (let i = 0; i < 3; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.85), darkLineMat);
      slat.position.set(2.34, 0.48 + i * 0.07, 0);
      parts.grille.add(slat);
    }
  }
  group.add(parts.grille);

  // 5. Headlights — freestanding lamps on stalks + connecting bar
  //    (vintage) or integrated into the fender fronts (sleek).
  parts.headlights = tag(new THREE.Group(), [0, 0, 0], [2.0, 1.0, 0], [0, -0.2, 0], 2);
  const lampGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.12, 20);
  lampGeo.rotateZ(Math.PI / 2);
  const ringGeo = new THREE.TorusGeometry(0.145, 0.022, 8, 32);
  ringGeo.rotateY(Math.PI / 2);
  [0.55, -0.55].forEach((z) => {
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(P.lampX, P.lampY, z);
    lamp.castShadow = true;
    parts.headlights.add(lamp);
    const ring = new THREE.Mesh(ringGeo, chromeMat);
    ring.position.set(P.lampX + 0.07, P.lampY, z);
    parts.headlights.add(ring);
    if (P.lampStalk) {
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8),
        chromeMat
      );
      stalk.position.set(P.lampX - 0.05, P.lampY - 0.2, z);
      parts.headlights.add(stalk);
    }
  });
  if (P.lampStalk) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 1.16), chromeMat);
    bar.position.set(P.lampX - 0.05, P.lampY - 0.28, 0);
    parts.headlights.add(bar);
  }
  group.add(parts.headlights);

  // 6. Engine block — block + 8 chrome cylinders + chrome pipes.
  parts.engine = tag(new THREE.Group(), [1.0, 0.5, 0], [1.5, 1.0, 0], [0, 0, 0.12], 3);
  const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.5), engineMat);
  block.castShadow = true;
  parts.engine.add(block);
  for (let i = 0; i < 8; i++) {
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12),
      chromeMat
    );
    cyl.position.set(-0.6 + i * 0.17, 0.3, 0);
    parts.engine.add(cyl);
  }
  const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.3, 12);
  pipeGeo.rotateZ(Math.PI / 2);
  [0.32, -0.32].forEach((z) => {
    const pipe = new THREE.Mesh(pipeGeo, chromeMat);
    pipe.position.set(0, 0.12, z);
    parts.engine.add(pipe);
  });
  group.add(parts.engine);

  // 7. Interior — crimson leather seats + steering wheel + dashboard.
  parts.interior = tag(new THREE.Group(), [0, 0, 0], [-1.2, 1.4, 0], [0, 0, 0.1], 5);
  const seatBaseGeo = new THREE.BoxGeometry(0.45, 0.18, 0.5);
  const seatBackGeo = new THREE.BoxGeometry(0.16, 0.55, 0.5);
  [0.32, -0.32].forEach((z) => {
    const base = new THREE.Mesh(seatBaseGeo, interiorMat);
    base.position.set(-0.6, 0.55, z);
    base.castShadow = true;
    parts.interior.add(base);
    const back = new THREE.Mesh(seatBackGeo, interiorMat);
    back.position.set(-0.92, 0.85, z);
    back.rotation.z = -0.25;
    back.castShadow = true;
    parts.interior.add(back);
  });
  const dash = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.22, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x1a1210, roughness: 0.7 })
  );
  dash.position.set(0.55, 0.95, 0);
  dash.castShadow = true;
  parts.interior.add(dash);
  const steeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.025, 10, 32),
    new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.6 })
  );
  steeringWheel.position.set(0.15, 0.95, 0.32);
  steeringWheel.rotation.y = Math.PI / 2 - 0.5;
  parts.interior.add(steeringWheel);
  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
    chromeMat
  );
  column.position.set(0.3, 0.85, 0.32);
  column.rotation.z = Math.PI / 3;
  parts.interior.add(column);
  group.add(parts.interior);

  // 8. Fenders — one group per side: front + rear arch bands over the
  //    wheels plus the running board between them. Real arch gaps, so
  //    the whitewall wheels sit INSIDE the arches.
  const wheelCenters = [
    [1.35, 0.42],
    [-1.25, 0.42],
  ];
  const fenderDefs = [
    ["lFender", 1, [0, 1.2, 1.6], [0.18, 0, 0], 9],
    ["rFender", -1, [0, 1.2, -1.6], [-0.18, 0, 0], 9],
  ];
  fenderDefs.forEach(([key, side, explode, rot, order]) => {
    const grp = tag(new THREE.Group(), [0, 0, 0], explode, rot, order);
    wheelCenters.forEach(([wx, wy]) => {
      const band = new THREE.Mesh(
        extrude(
          archBandShape(wx, wy, P.fenderROut, P.fenderRIn),
          P.fenderDepth,
          0.02,
          2
        ),
        bodyMat
      );
      // Extrude() centres the band on z=0, so place it on the wheel plane.
      band.position.z = side * P.fenderZ;
      band.castShadow = true;
      grp.add(band);
    });
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.05, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.85 })
    );
    board.position.set(0.05, 0.44, side * 0.82);
    board.castShadow = true;
    grp.add(board);
    const boardEdge = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.02, 0.02), chromeMat);
    boardEdge.position.set(0.05, 0.47, side * 0.93);
    grp.add(boardEdge);
    parts[key] = grp;
    group.add(grp);
  });

  // 9. Exhaust — twin chrome pipes + tips, slides out the back.
  parts.exhaust = tag(new THREE.Group(), [0, 0, 0], [-2.0, 0.5, 0], [0, 0.25, 0], 10);
  const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12);
  exhaustGeo.rotateZ(Math.PI / 2);
  const tipGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.25, 12);
  tipGeo.rotateZ(Math.PI / 2);
  [0.28, -0.28].forEach((z) => {
    const pipe = new THREE.Mesh(exhaustGeo, chromeMat);
    pipe.position.set(-0.6, 0.22, z);
    parts.exhaust.add(pipe);
    const tip = new THREE.Mesh(tipGeo, chromeMat);
    tip.position.set(-1.95, 0.22, z);
    parts.exhaust.add(tip);
  });
  group.add(parts.exhaust);

  // 10. Tail lights with chrome bezels (rear view, Speed canvas) —
  //     stay with the car. Plus a rear-mounted spare wheel: the
  //     instant 1930s read from behind.
  const tailLights = [];
  [[-2.36, 0.62, 0.52], [-2.36, 0.62, -0.52]].forEach((pos) => {
    const tl = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), tailMat);
    tl.position.set(...pos);
    tl.rotation.y = -Math.PI / 2;
    tailLights.push(tl);
    group.add(tl);
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.02, 8, 24),
      chromeMat
    );
    bezel.position.set(pos[0] - 0.01, pos[1], pos[2]);
    bezel.rotation.y = Math.PI / 2;
    group.add(bezel);
  });
  const spare = new THREE.Group();
  const spareTire = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.12, 16, 48), tireMat);
  spareTire.rotation.y = Math.PI / 2;
  spare.add(spareTire);
  const spareHub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 20),
    accentMat
  );
  spareHub.rotation.z = Math.PI / 2;
  spare.add(spareHub);
  const spareCover = new THREE.Mesh(
    new THREE.CircleGeometry(0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 })
  );
  spareCover.position.x = -0.13;
  spareCover.rotation.y = -Math.PI / 2;
  spare.add(spareCover);
  spare.position.set(-2.5, 0.78, 0);
  spare.castShadow = true;
  group.add(spare);

  // 11. Wheels — whitewall wire wheels, gold hubs.
  const wheelDefs = [
    ["flWheel", [1.35, 0.42, 0.8], [0, 0.4, 2.0], [0.5, 0, 0], 7],
    ["frWheel", [1.35, 0.42, -0.8], [0, 0.4, -2.0], [-0.5, 0, 0], 7],
    ["rlWheel", [-1.25, 0.42, 0.8], [-0.8, 0.4, 2.0], [0.5, 0, 0], 8],
    ["rrWheel", [-1.25, 0.42, -0.8], [-0.8, 0.4, -2.0], [-0.5, 0, 0], 8],
  ];
  const wheels = [];
  wheelDefs.forEach(([key, pos, explode, rot, order]) => {
    const grp = tag(new THREE.Group(), pos, explode, rot, order);
    grp.add(makeWheel(tireMat, accentMat));
    parts[key] = grp;
    wheels.push(grp);
    group.add(grp);
  });

  function dispose() {
    group.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose?.();
      }
      if (child.userData?.spokeMat) child.userData.spokeMat.dispose();
      if (child.userData?.wallMat) child.userData.wallMat.dispose();
    });
    [bodyMat, accentMat, chromeMat, tireMat, lampMat, tailMat, engineMat, interiorMat, glassMat, darkLineMat].forEach(
      (m) => m.dispose()
    );
  }

  return {
    group,
    bodyMat,
    accentMat,
    lampMat,
    tailMat,
    parts,
    wheels,
    headlights: parts.headlights,
    tailLights,
    dispose,
  };
}

/** Gold dust particle cloud (hero.js). */
export function makeDust(count, color = 0xd4af37, size = 0.025, opacity = 0.6) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 20;
    pos[i + 1] = Math.random() * 8;
    pos[i + 2] = (Math.random() - 0.5) * 20;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

/** Rain streaks as LineSegments (3d version's hero Rain toggle). */
export function makeRain(count = 2600) {
  const arr = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 60;
    const y = Math.random() * 30;
    const z = (Math.random() - 0.5) * 40;
    arr.set([x, y, z, x + 0.15, y - 0.8, z + 0.12], i * 6);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  const rain = new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({
      color: 0xbfd8ff,
      transparent: true,
      opacity: 0.4,
    })
  );
  rain.userData.count = count;
  return rain;
}

export function stepRain(rain) {
  const arr = rain.geometry.attributes.position.array;
  for (let i = 0; i < arr.length; i += 6) {
    arr[i + 1] -= 0.55;
    arr[i + 4] -= 0.55;
    arr[i] += 0.06;
    arr[i + 3] += 0.06;
    if (arr[i + 1] < 0) {
      const nx = (Math.random() - 0.5) * 60;
      const nz = (Math.random() - 0.5) * 40;
      arr.set([nx, 30, nz, nx + 0.15, 29.2, nz + 0.12], i);
    }
  }
  rain.geometry.attributes.position.needsUpdate = true;
}
