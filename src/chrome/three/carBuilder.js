/* Shared procedural car builder — ported from the owner's 90s scripts
   (hero.js / showroom.js / anatomy.js / speed.js / outro.js).
   One builder feeds every canvas so the car is the same machine everywhere:
   capsule fuselage, swept cabin, flowing fenders, chrome trim + grille,
   glowing headlights, torus wheels with gold hubs, reflective floor. */

import * as THREE from "three";

export function chromeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.08,
  });
}

export function tireMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 0.9 });
}

export function makeFloor(size = 90, color = 0x020202, roughness = 0.08) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.8,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
}

function makeWheel(tireMat, hubMat) {
  // Wheel plane is XY, axle along Z (torus is already XY — the owner's
  // original double-rotate laid the wheels flat; fixed here). Spokes +
  // gold hub make it a proper wire-spoke wheel; rotation.z spins it.
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.12, 16, 64), tireMat);
  tire.castShadow = true;
  wheel.add(tire);
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.12, 32),
    hubMat
  );
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);
  const spokeGeo = new THREE.BoxGeometry(0.32, 0.035, 0.035);
  const spokeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8e0,
    metalness: 1.0,
    roughness: 0.15,
  });
  for (let i = 0; i < 6; i++) {
    const spoke = new THREE.Mesh(spokeGeo, spokeMat);
    const a = (i / 6) * Math.PI * 2;
    spoke.position.set(Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0);
    spoke.rotation.z = a;
    wheel.add(spoke);
  }
  wheel.userData.spokeMat = spokeMat;
  return wheel;
}

/**
 * Build the procedural car.
 * @param {{ color?: string, accentColor?: string }} opts
 * @returns {{ group, bodyMat, accentMat, lampMat, tailMat, parts, wheels,
 *   headlights, tailLights, dispose }}
 * parts.* groups carry `userData.base` (their assembled position) and
 * `userData.explode` (offset applied at full explode) for the Anatomy canvas.
 */
export function buildProceduralCar({ color = "#050508", accentColor = "#c9a84c" } = {}) {
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.95,
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    metalness: 0.9,
    roughness: 0.1,
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

  const group = new THREE.Group();
  const parts = {};

  // Each part carries its assembled position (base), its explode offset,
  // a slight explode rotation, and a stagger order (0 = first out).
  // AnatomyCanvas drives a per-part factor from these so the car comes
  // apart piece by piece instead of in one flat spread.
  const tag = (grp, base, explode, rot = [0, 0, 0], order = 0) => {
    grp.userData.base = new THREE.Vector3(...base);
    grp.userData.explode = new THREE.Vector3(...explode);
    grp.userData.explodeRot = new THREE.Vector3(...rot);
    grp.userData.order = order;
    grp.position.copy(grp.userData.base);
    return grp;
  };

  // 1. Body shell — fuselage + chrome side trim
  parts.body = tag(new THREE.Group(), [0, 0, 0], [0, 2.0, 0], [0, 0, 0], 6);
  const mainBodyGeo = new THREE.CapsuleGeometry(0.65, 3.8, 32, 32);
  mainBodyGeo.rotateZ(Math.PI / 2);
  const mainBody = new THREE.Mesh(mainBodyGeo, bodyMat);
  mainBody.position.y = 0.6;
  mainBody.scale.set(1, 0.4, 0.85);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  parts.body.add(mainBody);
  const trimGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 16);
  trimGeo.rotateZ(Math.PI / 2);
  const leftTrim = new THREE.Mesh(trimGeo, chromeMat);
  leftTrim.position.set(0, 0.48, 1.15);
  const rightTrim = new THREE.Mesh(trimGeo, chromeMat);
  rightTrim.position.set(0, 0.48, -1.15);
  parts.body.add(leftTrim, rightTrim);
  group.add(parts.body);

  // 2. Cabin — swept profile, its own piece (lifts off the shell)
  parts.cabin = tag(new THREE.Group(), [0, 0, 0], [-0.6, 2.4, 0], [-0.12, 0, 0], 4);
  const cabinGeo = new THREE.CapsuleGeometry(0.5, 1.4, 32, 32);
  cabinGeo.rotateZ(Math.PI / 2);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(-0.5, 0.95, 0);
  cabin.scale.set(1, 0.5, 0.75);
  cabin.castShadow = true;
  parts.cabin.add(cabin);
  group.add(parts.cabin);

  // 3. Hood — long bonnet panel with a chrome spine
  parts.hood = tag(new THREE.Group(), [0, 0, 0], [1.4, 1.8, 0], [0, 0, -0.18], 0);
  const hoodPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.16, 1.15),
    bodyMat
  );
  hoodPanel.position.set(1.55, 1.02, 0);
  hoodPanel.castShadow = true;
  parts.hood.add(hoodPanel);
  const hoodSpine = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.05, 0.12),
    chromeMat
  );
  hoodSpine.position.set(1.55, 1.12, 0);
  parts.hood.add(hoodSpine);
  group.add(parts.hood);

  // 4. Grille — classic vertical chrome box
  parts.grille = tag(new THREE.Group(), [0, 0, 0], [2.2, 0.6, 0], [0, 0.25, 0], 1);
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.5), chromeMat);
  grille.position.set(2.4, 0.55, 0);
  grille.castShadow = true;
  parts.grille.add(grille);
  group.add(parts.grille);

  // 5. Headlights — lamps + chrome rings, fly forward as one piece
  parts.headlights = tag(new THREE.Group(), [0, 0, 0], [2.0, 1.0, 0], [0, -0.2, 0], 2);
  const lampGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
  lampGeo.rotateZ(Math.PI / 2);
  const ringGeo = new THREE.TorusGeometry(0.14, 0.02, 8, 32);
  ringGeo.rotateY(Math.PI / 2);
  [[2.3, 0.65, 0.55], [2.3, 0.65, -0.55]].forEach((pos) => {
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(...pos);
    lamp.castShadow = true;
    parts.headlights.add(lamp);
    const ring = new THREE.Mesh(ringGeo, chromeMat);
    ring.position.set(pos[0] + 0.06, pos[1], pos[2]);
    parts.headlights.add(ring);
  });
  group.add(parts.headlights);

  // 6. Engine block — block + 8 chrome cylinders + chrome pipes
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

  // 7. Interior — crimson leather seats + steering wheel + dashboard
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

  // 8. Fenders — long flowing sweeps
  const fenderGeo = new THREE.CapsuleGeometry(0.3, 4.2, 32, 32);
  fenderGeo.rotateZ(Math.PI / 2);
  parts.lFender = tag(new THREE.Group(), [0, 0, 0], [0, 1.2, 1.6], [0.18, 0, 0], 9);
  const lfMesh = new THREE.Mesh(fenderGeo, bodyMat);
  lfMesh.position.set(0.2, 0.5, 0.85);
  lfMesh.castShadow = true;
  parts.lFender.add(lfMesh);
  group.add(parts.lFender);
  parts.rFender = tag(new THREE.Group(), [0, 0, 0], [0, 1.2, -1.6], [-0.18, 0, 0], 9);
  const rfMesh = new THREE.Mesh(fenderGeo, bodyMat);
  rfMesh.position.set(0.2, 0.5, -0.85);
  rfMesh.castShadow = true;
  parts.rFender.add(rfMesh);
  group.add(parts.rFender);

  // 9. Exhaust — twin chrome pipes + tips, slides out the back
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

  // 10. Tail lights (rear view, Speed canvas)
  const tailLights = [];
  [[-1.85, 0.6, 0.4], [-1.85, 0.6, -0.4]].forEach((pos) => {
    const tl = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), tailMat);
    tl.position.set(...pos);
    tl.rotation.y = -Math.PI / 2;
    tailLights.push(tl);
    group.add(tl);
  });

  // 11. Wheels — spoked, gold hubs
  const wheelDefs = [
    ["flWheel", [1.3, 0.35, 0.85], [0, 0.4, 2.0], [0.5, 0, 0], 7],
    ["frWheel", [1.3, 0.35, -0.85], [0, 0.4, -2.0], [-0.5, 0, 0], 7],
    ["rlWheel", [-1.2, 0.35, 0.85], [-0.8, 0.4, 2.0], [0.5, 0, 0], 8],
    ["rrWheel", [-1.2, 0.35, -0.85], [-0.8, 0.4, -2.0], [-0.5, 0, 0], 8],
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
    });
    [bodyMat, accentMat, chromeMat, tireMat, lampMat, tailMat, engineMat, interiorMat].forEach(
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
