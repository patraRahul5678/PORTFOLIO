import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------------
   Low-poly WebGL park.  The page never scrolls "down": scroll progress rides
   a cyclist along a winding road, the camera follows him from above, and each
   stop opens its section as a panel.  Scrolling back rides him back.
------------------------------------------------------------------- */

const K = 0.1                                   // plane px -> world units
const STOPS = [['top', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['work', 'Experience'], ['projects', 'Projects'], ['contact', 'Contact']]
const STOP_CP = [0, 3, 6, 9, 12, 15]
const CP = [[1000, 1130], [700, 1110], [500, 1010], [380, 820], [350, 620], [430, 430], [600, 320], [830, 270], [1050, 255], [1250, 265], [1450, 300], [1620, 400], [1680, 560], [1670, 740], [1620, 900], [1500, 1030], [1280, 1110]]
const POND = { x: 560, y: 300, rx: 240, ry: 120 }
const GAZEBO = [175, 790], BENCH = [1250, 192], ROCKS = [1810, 560], MAIL = [1565, 1112]
const rng = (s) => () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296

/* ---------- path: closed Catmull-Rom, sampled to a polyline (plane px) ---------- */
const cr = (p0, p1, p2, p3, t) => [0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t))
const POLY = [], STOP_L = []
{
  const N = CP.length, STEP = 24; let acc = 0
  for (let i = 0; i < N; i++) {
    if (STOP_CP.includes(i)) STOP_L[STOP_CP.indexOf(i)] = acc
    for (let s = 0; s < STEP; s++) {
      const [x, y] = cr(CP[(i - 1 + N) % N], CP[i], CP[(i + 1) % N], CP[(i + 2) % N], s / STEP)
      if (POLY.length) acc += Math.hypot(x - POLY[POLY.length - 1].x, y - POLY[POLY.length - 1].y)
      POLY.push({ x, y, l: acc })
    }
  }
  acc += Math.hypot(CP[0][0] - POLY[POLY.length - 1].x, CP[0][1] - POLY[POLY.length - 1].y)
  POLY.push({ x: CP[0][0], y: CP[0][1], l: acc })
}
const TOTAL = POLY[POLY.length - 1].l
function at(L) {
  L = Math.min(Math.max(L, 0), TOTAL)
  let lo = 0, hi = POLY.length - 1
  while (hi - lo > 1) { const m = (lo + hi) >> 1; POLY[m].l <= L ? (lo = m) : (hi = m) }
  const a = POLY[lo], b = POLY[hi], t = b.l === a.l ? 0 : (L - a.l) / (b.l - a.l)
  const p0 = POLY[Math.max(0, lo - 2)], p1 = POLY[Math.min(POLY.length - 1, hi + 2)]
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, a: Math.atan2(p1.y - p0.y, p1.x - p0.x) }
}
const pathDist = (x, y) => { let m = 1e12; for (let k = 0; k < POLY.length; k += 2) { const dx = POLY[k].x - x, dy = POLY[k].y - y, d = dx * dx + dy * dy; if (d < m) m = d } return Math.sqrt(m) }
const inPond = (x, y, pad = 0) => ((x - POND.x) / (POND.rx + pad)) ** 2 + ((y - POND.y) / (POND.ry + pad)) ** 2 < 1
let B0 = 0, B1 = 0
{ let first = true; for (const p of POLY) if (inPond(p.x, p.y)) { if (first) { B0 = p.l; first = false } B1 = p.l } B0 -= 40; B1 += 40 }
const arch = (L) => (L > B0 && L < B1 ? 1.5 * Math.sin((Math.PI * (L - B0)) / (B1 - B0)) : 0)

/* ---------- scenery placement ---------- */
const keep = [[...GAZEBO, 170], [...BENCH, 100], [...ROCKS, 160], [...MAIL, 90]]
const free = (x, y, clr, pad) => x > 150 && x < 1850 && y > 150 && y < 1250 && pathDist(x, y) > clr && !inPond(x, y, pad) && !keep.some(([kx, ky, kr]) => Math.hypot(x - kx, y - ky) < kr)
function scatter(n, clr, gap, seed, pad = 40) {
  const r = rng(seed), out = []
  for (let t = 0; t < 5000 && out.length < n; t++) {
    const x = 120 + r() * 1760, y = 120 + r() * 1160
    if (free(x, y, clr, pad) && out.every((o) => Math.hypot(o.x - x, o.y - y) > gap)) out.push({ x, y, s: 0.8 + r() * 0.5, r: r() })
  }
  return out
}
const TREES = scatter(34, 125, 125, 7), BUSHES = scatter(44, 62, 70, 19, 10), ROCKS_S = scatter(12, 58, 90, 31, 10)
const LAMPS = []
for (let l = 140, k = 0; l < TOTAL - 60; l += 285, k++) {
  const p = at(l), side = k % 2 ? 1 : -1, x = p.x - Math.sin(p.a) * 66 * side, y = p.y + Math.cos(p.a) * 66 * side
  if (!inPond(x, y, 20) && x > 130 && x < 1870 && y > 130 && y < 1270) LAMPS.push({ x, y })
}
const FL_C = ['#ff7eb6', '#ffd23f', '#ffffff', '#ff8a4c', '#c77dff', '#ff9ec7']
const FLOWERS = (() => { const r = rng(99), o = []; for (let t = 0; t < 1200 && o.length < 420; t++) { const x = 100 + r() * 1800, y = 100 + r() * 1200; if (free(x, y, 52, 0)) o.push({ x, y, c: FL_C[(r() * FL_C.length) | 0], r: 2.4 + r() * 2.8 }) } return o })()
const TUFTS = (() => { const r = rng(5), o = []; for (let t = 0; t < 1200 && o.length < 300; t++) { const x = 100 + r() * 1800, y = 100 + r() * 1200; if (free(x, y, 46, 0)) o.push({ x, y }) } return o })()

/* ---------- procedural island texture (grass + road painted once) ---------- */
function paintIsland() {
  const W = 1880, H = 1280, cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const c = cv.getContext('2d'), X = (x) => x - 60, Y = (y) => y - 60, r = rng(3)
  c.fillStyle = '#74ae48'; c.fillRect(0, 0, W, H)
  for (let i = 0; i < 90; i++) {
    const x = r() * W, y = r() * H, rad = 90 + r() * 200, g = c.createRadialGradient(x, y, 0, x, y, rad)
    g.addColorStop(0, i % 2 ? 'rgba(168,214,96,.55)' : 'rgba(76,140,52,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2)
  }
  c.strokeStyle = '#4f8f36'; c.lineWidth = 2; c.lineCap = 'round'
  TUFTS.forEach((o) => { c.beginPath(); c.moveTo(X(o.x), Y(o.y)); c.lineTo(X(o.x) - 4, Y(o.y) - 10); c.moveTo(X(o.x), Y(o.y)); c.lineTo(X(o.x), Y(o.y) - 13); c.moveTo(X(o.x), Y(o.y)); c.lineTo(X(o.x) + 4, Y(o.y) - 10); c.stroke() })
  FLOWERS.forEach((o) => { c.fillStyle = o.c; c.beginPath(); c.arc(X(o.x), Y(o.y), o.r, 0, 6.3); c.fill() })
  c.lineJoin = 'round'
  const stroke = (w, col, dash, a = 1) => { c.beginPath(); POLY.forEach((p, i) => (i ? c.lineTo(X(p.x), Y(p.y)) : c.moveTo(X(p.x), Y(p.y)))); c.setLineDash(dash || []); c.lineWidth = w; c.strokeStyle = col; c.globalAlpha = a; c.stroke(); c.globalAlpha = 1; c.setLineDash([]) }
  stroke(98, '#efe3b8'); stroke(90, '#6e6a78'); stroke(82, '#aaa5b4'); stroke(76, '#c4bfce', [9, 15], 0.55); stroke(72, '#8f8a9a', [2, 24], 0.6)
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

/* ---------- small helpers ---------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...o })
const UP = new THREE.Vector3(0, 1, 0), _d = new THREE.Vector3()
const CYL = new THREE.CylinderGeometry(1, 1, 1, 8)
function seg(m, a, b, r) { _d.subVectors(b, a); const len = _d.length(); m.position.copy(a).addScaledVector(_d, 0.5); m.quaternion.setFromUnitVectors(UP, _d.normalize()); m.scale.set(r, len, r) }
function fadeMat(m) {
  m.customProgramCacheKey = () => 'fade'
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aFade;\nvarying float vFade;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvFade = aFade;')
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vFade;').replace('void main() {', 'void main() {\n if (vFade < 0.98) { float h = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))); if (h > vFade) discard; }')
  }
  return m
}
function inst(geo, material, mats, colors) {
  const m = new THREE.InstancedMesh(geo, material, mats.length)
  mats.forEach((mm, i) => { m.setMatrixAt(i, mm); if (colors) m.setColorAt(i, colors[i]) })
  m.castShadow = true; m.receiveShadow = true; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; return m
}
const M4 = (x, y, z, sx, sy, sz, ry = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(UP, ry), new THREE.Vector3(sx, sy, sz))

function pillTex(name, idx, on) {
  const c = document.createElement('canvas'); c.width = 440; c.height = 116; const g = c.getContext('2d')
  g.fillStyle = on ? '#ff7a45' : 'rgba(255,252,249,.96)'; g.strokeStyle = on ? 'rgba(255,255,255,.9)' : 'rgba(110,80,150,.28)'; g.lineWidth = 3
  g.beginPath(); g.roundRect(6, 8, 428, 92, 30); g.fill(); g.stroke()
  g.fillStyle = on ? 'rgba(255,255,255,.28)' : 'rgba(110,80,150,.13)'; g.beginPath(); g.arc(60, 54, 32, 0, 6.3); g.fill()
  g.fillStyle = on ? '#fff' : '#3a2a44'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.font = '800 30px Archivo, system-ui, sans-serif'; g.fillText('0' + idx, 60, 55)
  g.textAlign = 'left'; g.font = '800 46px Archivo, system-ui, sans-serif'; g.fillText(name, 110, 56)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}
function glowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  gr.addColorStop(0, 'rgba(255,244,196,.95)'); gr.addColorStop(0.4, 'rgba(255,233,160,.3)'); gr.addColorStop(1, 'rgba(255,233,160,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

/* ---------- the cyclist (local: +x forward, +y up, z = rider's right) ---------- */
function buildBike() {
  const bike = new THREE.Group(), lean = new THREE.Group(); bike.add(lean)
  const add = (g, m, castShadow = true) => { m.castShadow = castShadow; g.add(m); return m }
  const frameM = mat('#ffe9c7', { flatShading: false }), tireM = mat('#2a1738', { flatShading: false }), rimM = mat('#cdb8e6', { flatShading: false })
  const V = (x, y, z = 0) => new THREE.Vector3(x, y, z)
  const tube = (a, b, r = 0.15, m = frameM) => { const t = new THREE.Mesh(CYL, m); seg(t, V(...a), V(...b), r); t.castShadow = true; lean.add(t); return t }
  const R = [-4.2, 2], F = [4.2, 2], BB = [-0.6, 1.9], S = [-1.7, 5.4], H1 = [3.0, 5.7], H2 = [3.6, 4.1]
  ;[[R, BB], [BB, S], [S, R], [S, H1], [BB, H2], [H1, H2], [H2, F]].forEach(([a, b]) => tube(a, b))
  tube([3.1, 5.7], [3.2, 6.4]); tube([3.2, 6.4, -2], [3.2, 6.4, 2], 0.14, mat('#2a2a35', { flatShading: false }))
  const wheels = [R, F].map((p) => {
    const w = new THREE.Group(); w.position.set(p[0], p[1], 0)
    add(w, new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.2, 8, 28), tireM))
    for (let k = 0; k < 4; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.05, 0.05), rimM); s.rotation.z = (k * Math.PI) / 4; w.add(s) }
    add(w, new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 8), mat('#ffd23f')), false).rotation.x = Math.PI / 2
    lean.add(w); return w
  })
  add(lean, new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.3, 0.9), mat('#3a2a1a'))).position.set(-1.8, 5.7, 0)
  const bask = add(lean, new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.0, 1.2, 10), mat('#c98b52'))); bask.position.set(4.6, 6.1, 0)
  ;[['#ff7eb6', 0.6, 0.3], ['#ffd23f', 0, -0.5], ['#ffffff', -0.5, 0.4], ['#ff8a4c', 0.2, 0.7]].forEach(([c, x, z]) => add(lean, new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), mat(c))).position.set(4.6 + x, 6.9, z))
  const jacket = mat('#ff5a1f'), pants = mat('#2a2a52'), skin = mat('#f2c29b'), helmet = mat('#ffd23f')
  const hip = V(-1.7, 6.0), sh = V(1.8, 9.2)
  const torso = add(lean, new THREE.Mesh(CYL, jacket)); seg(torso, hip, sh, 1.05)
  add(lean, new THREE.Mesh(new THREE.SphereGeometry(1.05, 10, 8), jacket)).position.copy(sh)
  add(lean, new THREE.Mesh(new THREE.SphereGeometry(1.05, 10, 8), jacket)).position.copy(hip)
  const pack = add(lean, new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.4, 1.8), mat('#b93a0e'))); pack.position.set(-0.2, 8.3, 0); pack.rotation.z = 0.55
  add(lean, new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 10), skin)).position.set(3.0, 10.4, 0)
  const hel = add(lean, new THREE.Mesh(new THREE.SphereGeometry(1.08, 10, 8, 0, 6.3, 0, 1.6), helmet)); hel.position.set(2.9, 10.55, 0); hel.rotation.z = -0.2
  ;[-1, 1].forEach((z) => {
    const a1 = new THREE.Mesh(CYL, jacket), a2 = new THREE.Mesh(CYL, jacket); a1.castShadow = a2.castShadow = true; lean.add(a1, a2)
    seg(a1, V(1.8, 9.0, z * 0.95), V(2.9, 7.9, z * 1.25), 0.38); seg(a2, V(2.9, 7.9, z * 1.25), V(3.3, 6.5, z * 1.7), 0.34)
  })
  const legs = [-1, 1].map((z) => {
    const th = new THREE.Mesh(CYL, pants), sk = new THREE.Mesh(CYL, pants), crank = new THREE.Mesh(CYL, mat('#b9a07a', { flatShading: false })), foot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.7), mat('#ffffff'))
    th.castShadow = sk.castShadow = foot.castShadow = true; lean.add(th, sk, crank, foot); return { th, sk, crank, foot, z }
  })
  const scarf = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.7, 6, 1), new THREE.MeshStandardMaterial({ color: '#ffd23f', side: THREE.DoubleSide, flatShading: true })); lean.add(scarf)

  const L1 = 3.0, L2 = 3.3, ik = (hx, hy, px, py) => {
    const dx = px - hx, dy = py - hy, dist = Math.hypot(dx, dy) || 1, d = Math.min(dist, L1 + L2 - 0.05), a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a))
    const ux = dx / dist, uy = dy / dist, mx = hx + ux * a, my = hy + uy * a, k1 = [mx - uy * h, my + ux * h], k2 = [mx + uy * h, my - ux * h]; return k1[0] > k2[0] ? k1 : k2
  }
  const a = V(0, 0), b = V(0, 0), c = V(0, 0)
  return {
    group: bike, lean,
    update(wheel, crank, t, speed) {
      wheels.forEach((w) => (w.rotation.z = -wheel))
      legs.forEach((lg, i) => {
        const ang = crank + (i ? Math.PI : 0), px = BB[0] + Math.cos(ang) * 1.05, py = BB[1] + Math.sin(ang) * 1.05, hz = lg.z * 0.55, pz = lg.z * 0.85
        const [kx, ky] = ik(-1.7, 6.0, px, py + 0.3)
        seg(lg.th, a.set(-1.7, 6.0, hz), b.set(kx, ky, (hz + pz) / 2), 0.55); seg(lg.sk, b, c.set(px, py + 0.3, pz), 0.48)
        seg(lg.crank, a.set(BB[0], BB[1], pz * 0.6), b.set(px, py, pz * 0.9), 0.14); lg.foot.position.set(px + 0.45, py, pz)
      })
      const w = Math.sin(t * 9) * (0.15 + speed * 0.5), tilt = 0.25 + speed * 0.35 + Math.sin(t * 7) * 0.1
      scarf.rotation.set(0, w, tilt); scarf.position.set(1.6 - 1.5 * Math.cos(tilt), 9.3 + Math.sin(tilt) * 1.4, 0)
    },
  }
}

const CLOUDS = [['2%', '8%', 1, 0], ['64%', '4%', 1.3, -40], ['82%', '66%', 0.9, -90]]
const Cloud = () => <svg viewBox="0 0 200 90"><g fill="rgba(255,255,255,.9)"><ellipse cx="100" cy="60" rx="80" ry="24" /><circle cx="70" cy="42" r="30" /><circle cx="112" cy="34" r="36" /><circle cx="148" cy="48" r="26" /></g></svg>

export default function Scene() {
  const root = useRef()

  useEffect(() => {
    const host = root.current, spacer = host.querySelector('.spacer'), box = host.querySelector('.scene')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false, raf = 0, cleanup = () => {}

    const start = () => {
      if (disposed) return
      const mobile0 = innerWidth <= 820
      const renderer = new THREE.WebGLRenderer({ antialias: !mobile0, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile0 ? 1.25 : 1.6))
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
      box.appendChild(renderer.domElement)

      const scene = new THREE.Scene(); scene.fog = new THREE.Fog('#eadff0', 260, 760)
      const FOV = 32, tanH = Math.tan((FOV * Math.PI) / 360), camera = new THREE.PerspectiveCamera(FOV, 1, 5, 1400)
      scene.add(new THREE.HemisphereLight('#fff3ec', '#8ea65e', 1.55))
      const sun = new THREE.DirectionalLight('#ffe4bc', 2.6); sun.castShadow = true; sun.shadow.mapSize.set(mobile0 ? 1024 : 2048, mobile0 ? 1024 : 2048)
      Object.assign(sun.shadow.camera, { left: -46, right: 46, top: 46, bottom: -46, near: 10, far: 260 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.4
      scene.add(sun, sun.target)

      /* ground */
      const ISL = { x0: 6, z0: 6, w: 188, h: 128, r: 26 }
      const shape = new THREE.Shape(), { x0, z0, w, h, r: rr } = ISL, ya = -z0, yb = -(z0 + h)
      shape.moveTo(x0 + rr, ya); shape.lineTo(x0 + w - rr, ya); shape.quadraticCurveTo(x0 + w, ya, x0 + w, ya - rr); shape.lineTo(x0 + w, yb + rr); shape.quadraticCurveTo(x0 + w, yb, x0 + w - rr, yb)
      shape.lineTo(x0 + rr, yb); shape.quadraticCurveTo(x0, yb, x0, yb + rr); shape.lineTo(x0, ya - rr); shape.quadraticCurveTo(x0, ya, x0 + rr, ya)
      const topG = new THREE.ShapeGeometry(shape, 8); topG.rotateX(-Math.PI / 2)
      const pos = topG.attributes.position, uv = topG.attributes.uv
      for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x0) / w, 1 - (pos.getZ(i) - z0) / h)
      const top = new THREE.Mesh(topG, new THREE.MeshStandardMaterial({ map: paintIsland(), roughness: 1, metalness: 0 })); top.receiveShadow = true; top.position.y = 0.02; scene.add(top)
      const baseG = new THREE.ExtrudeGeometry(shape, { depth: 7, bevelEnabled: false, curveSegments: 8 }); baseG.rotateX(-Math.PI / 2)
      const base = new THREE.Mesh(baseG, mat('#7a7488', { flatShading: false })); base.position.y = -7; base.receiveShadow = true; scene.add(base)
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(2400, 2400), new THREE.MeshBasicMaterial({ color: '#eadff0' })); floor.rotation.x = -Math.PI / 2; floor.position.set(100, -7.2, 70); scene.add(floor)
      const sh = document.createElement('canvas'); sh.width = sh.height = 128; { const g = sh.getContext('2d'), gr = g.createRadialGradient(64, 64, 20, 64, 64, 64); gr.addColorStop(0, 'rgba(110,80,140,.35)'); gr.addColorStop(1, 'rgba(110,80,140,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128) }
      const blob = new THREE.Mesh(new THREE.PlaneGeometry(250, 190), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false })); blob.rotation.x = -Math.PI / 2; blob.position.set(100, -7.1, 70); scene.add(blob)

      /* pond + bridge */
      const rim = new THREE.Mesh(new THREE.CircleGeometry(1, 56), mat('#b9b3c4', { flatShading: false })); rim.rotation.x = -Math.PI / 2; rim.scale.set((POND.rx + 22) * K, (POND.ry + 22) * K, 1); rim.position.set(POND.x * K, 0.05, POND.y * K); rim.receiveShadow = true; scene.add(rim)
      const water = new THREE.Mesh(new THREE.CircleGeometry(1, 56), new THREE.MeshStandardMaterial({ color: '#46b3dc', roughness: 0.12, metalness: 0.15, transparent: true, opacity: 0.93 })); water.rotation.x = -Math.PI / 2; water.scale.set(POND.rx * K, POND.ry * K, 1); water.position.set(POND.x * K, 0.12, POND.y * K); water.receiveShadow = true; scene.add(water)
      {
        const wood = mat('#b9743c'), dark = mat('#8a5530'), planks = []
        for (let L = B0; L <= B1; L += 9.5) { const p = at(L); planks.push({ x: p.x * K, z: p.y * K, y: arch(L) + 0.2, a: p.a, pitch: Math.atan((arch(L + 3) - arch(L - 3)) / (6 * K)) }) }
        const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.75, 0.3, 8.6), wood, planks.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler()
        planks.forEach((p, i) => { e.set(0, -p.a, p.pitch, 'YZX'); q.setFromEuler(e); m4.compose(new THREE.Vector3(p.x, p.y, p.z), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, m4) })
        im.castShadow = im.receiveShadow = true; scene.add(im)
        const br = POLY.filter((p) => p.l >= B0 && p.l <= B1)
        ;[-1, 1].forEach((side) => {
          const pts = br.filter((_, i) => i % 3 === 0).map((p) => { const a = at(p.l).a; return new THREE.Vector3(p.x * K - Math.sin(a) * 4.2 * side, arch(p.l) + 2.2, p.y * K + Math.cos(a) * 4.2 * side) })
          const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.2, 6), dark); tube.castShadow = true; scene.add(tube)
          for (let i = 0; i < pts.length; i += 5) { const post = new THREE.Mesh(CYL, dark); seg(post, new THREE.Vector3(pts[i].x, pts[i].y - 2.0, pts[i].z), pts[i], 0.2); post.castShadow = true; scene.add(post) }
        })
      }

      /* trees (instanced, with dithered fade when they'd hide the rider) */
      const treeParts = [], tFade = new Float32Array(TREES.length).fill(1)
      {
        const pal = [['#356f33', '#4f9238', '#86bb52'], ['#2f6a3c', '#47893f', '#7db559'], ['#3d7a2e', '#5ea03a', '#9ccb5a'], ['#c05a85', '#df7fa6', '#f5b1c9']]
        const picks = TREES.map((o, i) => pal[i % 7 === 3 ? 3 : i % 3]), col = (k) => picks.map((p, i) => new THREE.Color(p[k]).offsetHSL(0, 0, (TREES[i].r - 0.5) * 0.06))
        const blobs = [[0, 6.4, 0, 4.4, 3.7, 0], [2.0, 5.3, 1.0, 3.1, 2.8, 1], [-2.2, 5.1, -0.8, 3.0, 2.7, 1], [0.2, 8.6, 0, 2.7, 2.4, 2]]
        const mk = (geo, material, lm, colors) => { const m = inst(geo, material, TREES.map((o) => lm(o.x * K, o.y * K, o.s, o.r * 6.28)), colors); geo.setAttribute('aFade', new THREE.InstancedBufferAttribute(tFade, 1)); treeParts.push(m); scene.add(m) }
        mk(new THREE.CylinderGeometry(0.35, 0.55, 4.2, 6), fadeMat(mat('#6b4a35')), (x, z, s, ry) => M4(x, 2.1 * s, z, s, s, s, ry))
        blobs.forEach(([bx, by, bz, sx, sy, ci]) => mk(new THREE.IcosahedronGeometry(1, 1), fadeMat(mat('#ffffff')), (x, z, s, ry) => { const c = Math.cos(ry), sn = Math.sin(ry); return M4(x + (bx * c + bz * sn) * s, by * s, z + (-bx * sn + bz * c) * s, sx * s, sy * s, sx * s, ry) }, col(ci)))
      }
      /* bushes + flowers */
      {
        const cols = BUSHES.map((o) => new THREE.Color(o.r > 0.5 ? '#3f8a3a' : '#4f9a40').offsetHSL(0, 0, (o.r - 0.5) * 0.05))
        scene.add(inst(new THREE.IcosahedronGeometry(1, 1), mat('#ffffff'), BUSHES.map((o) => M4(o.x * K, 0.9 * o.s, o.y * K, 2.3 * o.s, 1.5 * o.s, 2.3 * o.s, o.r * 6)), cols))
        const r2 = rng(8), fm = [], fc = []
        BUSHES.forEach((o) => { for (let k = 0; k < 4; k++) { const a = r2() * 6.28, d = r2() * 1.7 * o.s; fm.push(M4(o.x * K + Math.cos(a) * d, (1.45 + r2() * 0.5) * o.s, o.y * K + Math.sin(a) * d, 0.34, 0.34, 0.34)); fc.push(new THREE.Color(FL_C[(r2() * FL_C.length) | 0])) } })
        scene.add(inst(new THREE.IcosahedronGeometry(1, 0), mat('#ffffff'), fm, fc))
      }
      /* rocks */
      {
        const rk = [...ROCKS_S.map((o) => [o.x, o.y, 1.1 * o.s, o.r]), [ROCKS[0] - 40, ROCKS[1] - 60, 3.4, 0.2], [ROCKS[0] + 30, ROCKS[1] + 10, 4.6, 0.6], [ROCKS[0] - 30, ROCKS[1] + 80, 2.8, 0.9],
          ...[[-200, -80], [160, -100], [-80, 110], [210, 30], [-230, 30]].map(([dx, dy], i) => [POND.x + dx, POND.y + dy, 1.2 + (i % 3) * 0.5, i * 0.2])]
        const cols = rk.map((o) => new THREE.Color('#9a95a4').offsetHSL(0, 0, (o[3] - 0.5) * 0.12))
        scene.add(inst(new THREE.DodecahedronGeometry(1, 0), mat('#ffffff'), rk.map((o) => M4(o[0] * K, o[2] * 0.55, o[1] * K, o[2] * 1.3, o[2] * 0.95, o[2] * 1.1, o[3] * 6)), cols))
      }
      /* lamps */
      {
        const glow = new THREE.SpriteMaterial({ map: glowTex(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
        scene.add(inst(new THREE.CylinderGeometry(0.16, 0.2, 6.2, 6), mat('#3b3a47'), LAMPS.map((o) => M4(o.x * K, 3.1, o.y * K, 1, 1, 1))))
        scene.add(inst(new THREE.BoxGeometry(1.1, 1.4, 1.1), new THREE.MeshStandardMaterial({ color: '#ffe7a0', emissive: '#ffd36a', emissiveIntensity: 1.1 }), LAMPS.map((o) => M4(o.x * K, 6.7, o.y * K, 1, 1, 1))))
        LAMPS.forEach((o) => { const s = new THREE.Sprite(glow); s.position.set(o.x * K, 6.7, o.y * K); s.scale.set(5, 5, 1); scene.add(s) })
      }
      /* gazebo, bench, mailbox */
      {
        const g = new THREE.Group(); g.position.set(GAZEBO[0] * K, 0, GAZEBO[1] * K)
        const f = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 8.8, 0.7, 6), mat('#c6c1cf')); f.position.y = 0.35; f.receiveShadow = true; g.add(f)
        for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.283, p = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 6.6, 6), mat('#7a4b2a')); p.position.set(Math.cos(a) * 7, 4, Math.sin(a) * 7); p.castShadow = true; g.add(p) }
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(8.1, 8.1, 0.5, 6), mat('#6b4a35')); ring.position.y = 7.2; g.add(ring)
        const roof = new THREE.Mesh(new THREE.ConeGeometry(10.2, 4.8, 6), mat('#4d475d')); roof.position.y = 9.9; roof.castShadow = true; g.add(roof)
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), mat('#d9a066')); tip.position.y = 12.5; g.add(tip)
        ;[-1, 1].forEach((s) => { const b = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 1.4), mat('#b9743c')); b.position.set(0, 1.5, s * 3.4); b.castShadow = true; g.add(b) })
        g.rotation.y = -0.4; scene.add(g)
        const bn = new THREE.Group(); bn.position.set(BENCH[0] * K, 0, BENCH[1] * K)
        const seat = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 2), mat('#b9743c')); seat.position.y = 1.7; const back = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 0.4), mat('#c98b52')); back.position.set(0, 2.9, -0.9)
        ;[-3, 3].forEach((x) => { const l = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.7, 1.8), mat('#6b4a35')); l.position.set(x, 0.85, 0); bn.add(l) })
        ;[seat, back].forEach((m) => { m.castShadow = true; bn.add(m) }); scene.add(bn)
        const mb = new THREE.Group(); mb.position.set(MAIL[0] * K, 0, MAIL[1] * K)
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 0.5), mat('#6b4a35')); post.position.y = 2; const box = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 1.6), mat('#e0453a')); box.position.y = 4.6
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.6), mat('#ffd23f')); flag.position.set(1.5, 5.2, 0); ;[post, box, flag].forEach((m) => { m.castShadow = true; mb.add(m) }); mb.rotation.y = -0.6; scene.add(mb)
      }

      /* stops: glowing rings + floating labels */
      const ringM = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ff9a4a', emissiveIntensity: 1.2 }), labels = []
      STOP_L.forEach((l, i) => {
        const p = at(l), x = p.x * K, z = p.y * K
        const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.22, 8, 40), ringM); ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.25, z); scene.add(ring)
        const line = new THREE.Mesh(CYL, new THREE.MeshBasicMaterial({ color: '#ffffff' })); seg(line, new THREE.Vector3(x, 0.3, z), new THREE.Vector3(x, 11, z), 0.07); scene.add(line)
        const n = pillTex(STOPS[i][1], i, false), a = pillTex(STOPS[i][1], i, true)
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: n, depthTest: false, transparent: true })); sp.position.set(x, 13, z); sp.scale.set(15, 3.97, 1); sp.renderOrder = 10; scene.add(sp)
        labels.push({ sp, n, a })
      })

      /* rider */
      const rider = buildBike(); scene.add(rider.group)

      /* ---------- state + loop ---------- */
      const panels = STOPS.map(([id]) => document.getElementById(id)), navLinks = [...document.querySelectorAll('nav a[href^="#"]')]
      let vw = 0, vh = 0, mobile = false, marks = [], legs = [], dIn = 54, dOut = 220
      let L = 0, hd = 0, dirS = 1, crank = 0, wheel = 0, camD = 220, fx = 0, fy = 0, act = -1, last = performance.now(), first = true, lean = 0

      const layout = () => {
        vw = innerWidth; vh = innerHeight; mobile = vw <= 820
        renderer.setSize(vw, vh, false); camera.aspect = vw / vh
        dIn = mobile ? 68 : 54
        const free = mobile ? vw / (vh * 0.6) : (vw * 0.97 - Math.min(580, vw * 0.48)) / vh
        dOut = Math.min(Math.max(120 / (tanH * free), 74 / (tanH * (mobile ? 0.55 : 1))), 380)
        const dw = vh * 0.75, lg = vh * (mobile ? 0.9 : 1.05); let acc = 0
        marks = []; legs = []
        STOPS.forEach((_, i) => {
          const d = i === 0 ? vh * 0.8 : dw
          marks.push({ a: acc, b: acc + d, L: STOP_L[i] }); acc += d
          if (i < STOPS.length - 1) { legs.push({ a: acc, b: acc + lg, L0: STOP_L[i], L1: STOP_L[i + 1] }); acc += lg }
        })
        spacer.style.height = acc + vh + 'px'
      }
      const target = (sy) => {
        for (let i = 0; i < marks.length; i++) {
          if (sy <= marks[i].b) return marks[i].L
          if (i < legs.length && sy <= legs[i].b) { const t = (sy - legs[i].a) / (legs[i].b - legs[i].a), e = t * t * t * (t * (t * 6 - 15) + 10); return legs[i].L0 + (legs[i].L1 - legs[i].L0) * e }
        }
        return STOP_L[STOP_L.length - 1]
      }

      const v = new THREE.Vector3(), rv = new THREE.Vector3(), pv = new THREE.Vector3()
      const frame = (now) => {
        raf = requestAnimationFrame(frame)
        const dt = Math.max(0.001, Math.min(0.1, (now - last) / 1000)); last = now
        const Lt = target(scrollY), pL = L
        L += (Lt - L) * (reduce || first ? 1 : 1 - Math.exp(-dt * 4.5))
        const dL = L - pL, adL = Math.abs(dL) * K
        if (Math.abs(dL) > 0.12) dirS = dL > 0 ? 1 : -1
        const P = at(L), tgt = P.a + (dirS < 0 ? Math.PI : 0)
        let dd = tgt - hd; dd = Math.atan2(Math.sin(dd), Math.cos(dd)); hd += dd * (first ? 1 : 1 - Math.exp(-dt * 8))
        wheel += adL / 1.95; crank += adL * 0.55
        lean += ((Math.max(-0.35, Math.min(0.35, dd * 0.9)) * Math.min(1, adL / (dt * 10 + 0.01))) - lean) * 0.1

        let a = -1, best = 90
        STOP_L.forEach((s, i) => { const d = Math.abs(L - s); if (d < best) { best = d; a = i } })
        if (a !== act) {
          act = a
          panels.forEach((p, i) => { if (p) { p.classList.toggle('on', i === a); if (i === a) p.scrollTop = 0 } })
          navLinks.forEach((n) => n.classList.toggle('cur', n.getAttribute('href') === '#' + STOPS[Math.max(a, 0)][0]))
          labels.forEach((lb, i) => { lb.sp.material.map = i === a ? lb.a : lb.n; lb.sp.material.needsUpdate = true; lb.sp.scale.set(i === a ? 17 : 15, i === a ? 4.5 : 3.97, 1) })
        }

        const s0 = Math.atan((arch(L + 3) - arch(L - 3)) / (6 * K))
        rider.group.position.set(P.x * K, 0.05 + arch(L), P.y * K); rider.group.rotation.set(0, -hd, dirS > 0 ? s0 : -s0)
        rider.lean.rotation.x = lean
        rider.update(wheel, crank, now / 1000, Math.min(1, adL / (dt * 14)))

        // camera: close on the rider, slowly orbiting; zoomed out over the whole island at the start
        const ramp = Math.min(1, Math.max(0, L / 320)), ease = ramp * ramp * (3 - 2 * ramp)
        camD += ((dOut + (dIn - dOut) * ease) - camD) * (reduce || first ? 1 : 1 - Math.exp(-dt * 5))
        const cx = 100 + (P.x * K - 100) * ease, cz = 70 + (P.y * K - 70) * ease, yaw = 0.62 + 0.4 * Math.sin(L / 650), el = 0.97
        camera.position.set(cx + camD * Math.cos(el) * Math.sin(yaw), camD * Math.sin(el), cz + camD * Math.cos(el) * Math.cos(yaw)); camera.lookAt(cx, 0, cz)
        const panelW = Math.min(580, vw * 0.48), fxT = a >= 0 && !mobile ? (vw * 0.97 - panelW) / 2 : vw / 2, fyT = a >= 0 && mobile ? vh * 0.27 : vh * (mobile ? 0.46 : 0.55)
        if (first) { fx = fxT; fy = fyT } else { const kf = 1 - Math.exp(-dt * 3.5); fx += (fxT - fx) * kf; fy += (fyT - fy) * kf }
        camera.setViewOffset(vw, vh, vw / 2 - fx, vh / 2 - fy, vw, vh); camera.updateProjectionMatrix()
        sun.position.set(cx + 46, 78, cz + 30); sun.target.position.set(cx, 0, cz); sun.target.updateMatrixWorld()
        const sz = Math.max(46, Math.min(95, camD * 0.7)); Object.assign(sun.shadow.camera, { left: -sz, right: sz, top: sz, bottom: -sz }); sun.shadow.camera.updateProjectionMatrix()

        // dithered fade for trees standing between camera and rider
        camera.updateMatrixWorld(); rv.set(P.x * K, 4, P.y * K).project(camera); let changed = false
        const dR = camera.position.distanceTo(rider.group.position)
        for (let i = 0; i < TREES.length; i++) {
          const o = TREES[i]; v.set(o.x * K, 5 * o.s, o.y * K)
          const dT = camera.position.distanceTo(v); pv.copy(v).project(camera)
          const dx = ((pv.x - rv.x) * vw) / 2, dy = ((pv.y - rv.y) * vh) / 2, rad = ((6.2 * o.s) / (2 * tanH * dT)) * vh
          const want = dT < dR - 2 && Math.hypot(dx, dy) < rad + 70 ? 0.12 : 1, nf = tFade[i] + (want - tFade[i]) * 0.2
          if (Math.abs(nf - tFade[i]) > 0.003) { tFade[i] = nf; changed = true }
        }
        if (changed) treeParts.forEach((m) => (m.geometry.attributes.aFade.needsUpdate = true))
        water.position.y = 0.12 + Math.sin(now / 900) * 0.02
        ringM.emissiveIntensity = 1.1 + Math.sin(now / 400) * 0.35
        first = false
        renderer.render(scene, camera)
      }

      const onClick = (e) => {
        const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return
        const i = STOPS.findIndex(([id]) => '#' + id === a.getAttribute('href')); if (i < 0) return
        e.preventDefault(); scrollTo({ top: (marks[i].a + marks[i].b) / 2, behavior: 'smooth' })
      }
      layout(); addEventListener('resize', layout); document.addEventListener('click', onClick)
      raf = requestAnimationFrame(frame)
      cleanup = () => {
        cancelAnimationFrame(raf); removeEventListener('resize', layout); document.removeEventListener('click', onClick)
        scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => { m.map && m.map.dispose(); m.dispose() }) })
        renderer.dispose(); renderer.domElement.remove()
      }
    }

    Promise.race([document.fonts.load('800 40px Archivo'), new Promise((r) => setTimeout(r, 500))]).then(start)
    return () => { disposed = true; cleanup() }
  }, [])

  return (
    <div ref={root}>
      <div className="scene" aria-hidden="true">
        <div className="clouds">{CLOUDS.map(([l, t, s, d], i) => <div key={i} className="cloud" style={{ left: l, top: t, width: 190 * s, animationDelay: d + 's' }}><Cloud /></div>)}</div>
      </div>
      <div className="spacer" />
    </div>
  )
}
