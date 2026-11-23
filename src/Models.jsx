import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'

/* ---- 3D models: playful toy-like set, one per section ---- */
const INK = '#0E1424', COB = '#2A4BFF', CORAL = '#FF6B4A', SUN = '#FFC83D', MINT = '#2EC4A0', LILAC = '#B79CFF'
const toy = (c, extra = {}) => <meshStandardMaterial color={c} roughness={0.35} metalness={0.1} {...extra} />

function Spin({ children, speed = 0 }) {
  const r = useRef()
  useFrame((s, d) => {
    if (speed) r.current.rotation.y += d * speed
    else r.current.rotation.y += (s.pointer.x * 0.6 - r.current.rotation.y) * 0.06
    r.current.rotation.x += (-s.pointer.y * 0.3 - r.current.rotation.x) * 0.05
  })
  return <group ref={r}>{children}</group>
}

/* Hero: CorePilot robot, eyes and head follow the cursor, blinks, waves */
function Robot() {
  const head = useRef(), eyes = useRef(), ant = useRef(), hands = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    head.current.rotation.y += (s.pointer.x * 0.5 - head.current.rotation.y) * 0.1
    head.current.rotation.x += (-s.pointer.y * 0.35 - head.current.rotation.x) * 0.1
    eyes.current.scale.y = t % 3.5 < 0.14 ? 0.1 : 1
    ant.current.scale.setScalar(1 + Math.sin(t * 5) * 0.18)
    hands.current.children.forEach((h, i) => { h.position.y = -0.4 + Math.sin(t * 2.4 + i * 3) * 0.22 })
  })
  return (
    <group scale={0.95} position={[0, -0.3, 0]}>
      <mesh position={[0, -0.85, 0]}><capsuleGeometry args={[0.7, 0.7, 8, 24]} />{toy(COB)}</mesh>
      <mesh position={[0, -0.8, 0.68]}><boxGeometry args={[0.55, 0.3, 0.06]} />{toy(INK)}</mesh>
      <mesh position={[0, -0.8, 0.72]}><boxGeometry args={[0.35, 0.08, 0.02]} /><meshBasicMaterial color={MINT} /></mesh>
      <group ref={hands}>{[-1.25, 1.25].map((x) => <mesh key={x} position={[x, -0.4, 0.1]}><sphereGeometry args={[0.28, 24, 24]} />{toy(CORAL)}</mesh>)}</group>
      <group ref={head} position={[0, 0.85, 0]}>
        <RoundedBox args={[1.8, 1.35, 1.35]} radius={0.35} smoothness={6}>{toy(SUN)}</RoundedBox>
        <RoundedBox args={[1.4, 0.85, 0.1]} radius={0.2} position={[0, 0, 0.68]}>{toy(INK)}</RoundedBox>
        <group ref={eyes} position={[0, 0.1, 0.76]}>{[-0.34, 0.34].map((x) => <mesh key={x} position={[x, 0, 0]} scale={[1, 1.25, 0.5]}><sphereGeometry args={[0.14, 20, 20]} /><meshBasicMaterial color={MINT} /></mesh>)}</group>
        <mesh position={[0, -0.12, 0.76]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.17, 0.035, 12, 24, Math.PI]} /><meshBasicMaterial color={MINT} /></mesh>
        {[-1, 1].map((x) => <mesh key={x} position={[x * 0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />{toy(COB)}</mesh>)}
        <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />{toy(INK)}</mesh>
        <mesh ref={ant} position={[0, 1.25, 0]}><sphereGeometry args={[0.16, 20, 20]} />{toy(CORAL, { emissive: CORAL, emissiveIntensity: 0.5 })}</mesh>
      </group>
    </group>
  )
}

/* About: a tiny Rubik's cube whose top layer keeps twisting */
const PAL = [COB, CORAL, SUN, MINT, LILAC, INK]
function Cube() {
  const top = useRef()
  useFrame((s) => {
    const k = s.clock.elapsedTime / 1.8, f = k % 1, e = Math.min(1, f * 2.5)
    top.current.rotation.y = (Math.floor(k) + e * e * (3 - 2 * e)) * Math.PI / 2
  })
  const cells = []
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) cells.push([x, y, z])
  const mk = (c, i) => (<RoundedBox key={i} args={[0.52, 0.52, 0.52]} radius={0.07} position={c.map((v) => v * 0.58)}>{toy(PAL[(c[0] + c[1] * 2 + c[2] * 3 + 9) % 6])}</RoundedBox>)
  return (<group scale={1.2}><group ref={top}>{cells.filter((c) => c[1] === 1).map(mk)}</group>{cells.filter((c) => c[1] < 1).map(mk)}</group>)
}

/* Skills: a little solar system, each planet is a skill group */
function Planet({ r, s, c, sp, tilt, ring }) {
  const g = useRef()
  useFrame((_, d) => (g.current.rotation.y += d * sp))
  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.012, 8, 120]} /><meshBasicMaterial color="#9aa3bd" /></mesh>
      <group ref={g}><group position={[r, 0, 0]}>
        <mesh><sphereGeometry args={[s, 32, 32]} />{toy(c)}</mesh>
        {ring && <mesh rotation={[1.2, 0.3, 0]}><torusGeometry args={[s * 1.7, 0.05, 8, 48]} />{toy(SUN)}</mesh>}
      </group></group>
    </group>
  )
}
const Solar = () => (
  <group scale={0.95}>
    <mesh><sphereGeometry args={[0.6, 40, 40]} />{toy(SUN, { emissive: SUN, emissiveIntensity: 0.45 })}</mesh>
    <Planet r={1.2} s={0.18} c={CORAL} sp={1.4} tilt={0.3} />
    <Planet r={1.8} s={0.3} c={COB} sp={0.9} tilt={-0.4} ring />
    <Planet r={2.4} s={0.24} c={MINT} sp={0.6} tilt={0.7} />
    <Planet r={2.9} s={0.2} c={LILAC} sp={0.4} tilt={-0.15} />
  </group>
)

/* Experience: a rocket, because I ship */
function Rocket() {
  const fl = useRef()
  useFrame((s) => { const t = s.clock.elapsedTime; fl.current.scale.set(1 + Math.sin(t * 25) * 0.12, 1 + Math.sin(t * 18) * 0.25, 1) })
  return (
    <group rotation={[0, 0, -0.5]} scale={1.05}>
      <mesh><cylinderGeometry args={[0.55, 0.55, 1.8, 32]} />{toy(INK)}</mesh>
      <mesh position={[0, 1.3, 0]}><coneGeometry args={[0.55, 0.85, 32]} />{toy(CORAL)}</mesh>
      <mesh position={[0, 0.35, 0.5]}><sphereGeometry args={[0.24, 24, 24]} />{toy(SUN, { emissive: SUN, emissiveIntensity: 0.3 })}</mesh>
      <mesh position={[0, 0.35, 0.5]}><torusGeometry args={[0.26, 0.05, 12, 32]} />{toy(SIL_)}</mesh>
      {[0, 1, 2].map((i) => (<group key={i} rotation={[0, i * 2.094, 0]}><mesh position={[0.62, -0.75, 0]} rotation={[0, 0, -0.35]}><boxGeometry args={[0.5, 0.85, 0.08]} />{toy(COB)}</mesh></group>))}
      <mesh ref={fl} position={[0, -1.45, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.36, 0.9, 20]} /><meshBasicMaterial color={SUN} /></mesh>
    </group>
  )
}
const SIL_ = '#C9CED8'

/* Projects: bouncy toy building blocks */
function Block({ p, s, c, ph }) {
  const r = useRef()
  useFrame((st) => { const t = st.clock.elapsedTime + ph; r.current.position.y = p[1] + Math.sin(t * 1.5) * 0.13; r.current.rotation.y = Math.sin(t * 0.8) * 0.4 })
  return (
    <group ref={r} position={p}>
      <RoundedBox args={[s, s * 0.6, s]} radius={0.08} smoothness={4}>{toy(c)}</RoundedBox>
      {[-1, 1].map((x) => [-1, 1].map((z) => (<mesh key={x + '_' + z} position={[x * s * 0.25, s * 0.34, z * s * 0.25]}><cylinderGeometry args={[s * 0.12, s * 0.12, s * 0.1, 20]} />{toy(c)}</mesh>)))}
    </group>
  )
}
const Blocks = () => (
  <group>
    <Block p={[-0.8, -1.2, 0]} s={1.5} c={COB} ph={0} />
    <Block p={[0.9, -1.2, 0.2]} s={1.3} c={CORAL} ph={1.2} />
    <Block p={[0, -0.3, 0]} s={1.25} c={SUN} ph={2.4} />
    <Block p={[0.55, 0.6, 0]} s={1.0} c={MINT} ph={3.6} />
    <Block p={[-0.5, 1.3, 0]} s={0.9} c={LILAC} ph={4.8} />
  </group>
)

/* Contact: an envelope that keeps opening and popping out confetti */
function Mail() {
  const flap = useRef(), bits = useRef()
  useFrame((s) => {
    const t = s.clock.elapsedTime
    flap.current.rotation.x = (Math.sin(t * 1.4) * 0.5 + 0.5) * 2.6
    bits.current.children.forEach((b, i) => { b.position.y = 0.5 + Math.abs(Math.sin(t * 1.6 + i * 1.3)) * 1.1; b.rotation.z = t + i })
  })
  return (
    <group rotation={[0.15, 0, 0]} position={[0, -0.3, 0]}>
      <RoundedBox args={[2.4, 1.6, 0.2]} radius={0.08} smoothness={4}>{toy(COB)}</RoundedBox>
      <group ref={flap} position={[0, 0.8, 0.12]}><group scale={[1, 0.4, 1]}><mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[1.4, 1.4, 0.06, 3]} />{toy(CORAL)}</mesh></group></group>
      <group ref={bits} position={[0, 0, -0.1]}>{[[-0.7, CORAL], [0, SUN], [0.7, MINT]].map(([x, c], i) => (<mesh key={i} position={[x, 0.5, 0]}><octahedronGeometry args={[0.18]} />{toy(c)}</mesh>))}</group>
    </group>
  )
}

export default function Model({ kind }) {
  const M = { knot: Robot, crystal: Cube, orbit: Solar, gem: Rocket, stack: Blocks, ring: Mail }[kind]
  const speed = { crystal: 0.5, orbit: 0.1 }[kind] || 0
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={1} /><directionalLight position={[3, 4, 4]} intensity={2.2} /><pointLight position={[-4, -2, 3]} intensity={25} color="#ffd9a0" />
      <Float speed={1.8} floatIntensity={0.7}><Spin speed={speed}><M /></Spin></Float>
    </Canvas>
  )
}

