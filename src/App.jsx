import { useEffect, useRef, useState } from 'react'
import Scene from './Scene.jsx'
import { FaGithub } from 'react-icons/fa';

const MAIL = 'kanhapatra801@gmail.com'
const CP = 'https://www.corepilot.online'
const RESUME = 'https://drive.google.com/drive/folders/1EfpC1bOlBL5d2rXmCh8hB-qEjJVIv2a2' // put your resume.pdf inside the /public folder
const Ext = ({ href, children }) => <a className="vl" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
const SK = {
  Languages: 'Python, JavaScript, TypeScript, Java, C++, SQL',
  Frontend: 'React.js, React Native, Next.js, HTML5, CSS3',
  Backend: 'Node.js, Express, REST, WebSockets, GraphQL, JWT, OAuth 2.0, RBAC',
  Databases: 'MongoDB, Mongoose, SQL, Query Optimization',
  AI: 'LLMs, RAG, Prompt Engineering, AI API Integration',
  DevOps: 'AWS, GCP, Docker, Kubernetes, GitHub Actions, Kafka, Redis',
}
const J = [
  {
    when: 'Jan 2026 – Present', t: <Ext href={CP}>CorePilot ↗</Ext>, role: 'Founder & Software Engineer · Remote', pts: [
      'Architecting a full-stack SaaS developer-tooling platform with LLM orchestration and RAG.',
      'Sole engineer across APIs, MongoDB schemas, authentication, tenant isolation and data security.',
      <>Visit <Ext href={CP}>corepilot.online ↗</Ext> (in active development).</>]
  },
  {
    when: 'Jan – Aug 2026', t: 'Smartnex Technologies', role: 'Software Engineer Intern · Bhubaneswar', pts: [
      'Built features for RayEngineering HRMS, a production SaaS HR system.',
      <>Built the full backend and admin panel for SiteLink, a construction hiring platform with Razorpay payments. <span className="badge live">● Live on Google Play Store</span></>,
      'REST APIs with Node, Express, JWT and RBAC; reusable React components cut UI redundancy by 25%.',
      'Tuned MongoDB queries and shipped through GitHub Actions CI/CD.']
  },
  {
    when: '2026', t: <>DocSpot <span className="badge soon">Coming soon on Play Store</span></>, role: 'Android App & Admin Panel · Independent Project', pts: [
      'Flutter Android app with Firebase authentication, cloud data, notifications and real-time sync through Cloud Firestore.',
      'React and Node.js admin panel to manage content, users, configurations and platform operations securely.']
  },
]
const P = [
  ['DocSpot', 'Flutter Android app with Firebase and a React admin panel synced through Firestore. Coming soon on Play Store.', 'Flutter · React · Firebase', 'https://www.docspot.si', 'https://github.com/patraRahul5678/DOCSPOT-LANDING-PAGE'],
  ['Connectra', 'Real-time chat with WebSockets, presence tracking and JWT-secured REST APIs.', 'React · Node · MongoDB', 'https://connectra-vljd.onrender.com', 'https://github.com/patraRahul5678/Connectra'],
  ['CodeLens', 'AI-powered code review. Gemini API, custom prompts, severity-ranked fixes. About 40% less manual review work.', 'React · Node · Gemini', 'https://codelens-1-e0t1.onrender.com/', 'https://github.com/patraRahul5678/CodeLens'],
  ['Leave Management', 'Leave requests and approvals with bcrypt, protected routes and RBAC.', 'React · Express · MongoDB', 'https://leave-management-sysytem-6.onrender.com/', 'https://github.com/patraRahul5678/LEAVE-MANAGEMENT-SYSYTEM'],
  ['CarZone', 'An Uber-inspired full-stack car rental marketplace built with modern web technologies.', 'React · Express · MongoDB', 'https://carzone-1-e0t1.onrender.com/', 'https://github.com/patraRahul5678/CarZone'],
]
const NAV = [['top', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['work', 'Experience'], ['projects', 'Projects'], ['contact', 'Contact']]

/* Inline-style helpers */
const resumeBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', borderRadius: 999,
  border: '1px solid currentColor', color: 'inherit',
  fontSize: 13, fontWeight: 600, letterSpacing: '.04em',
  textDecoration: 'none', whiteSpace: 'nowrap', cursor: 'pointer',
}

function useMedia(query) {
  const [m, setM] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const h = (e) => setM(e.matches)
    setM(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [query])
  return m
}

/* intro: code symbols spiral in, assemble into RAHUL, then shatter to reveal the site */
const GLY = ['{', '}', '<', '>', '/', ';', '=', '(', ')', '[', ']', '0', '1', '#', '$', '&', '*', '+']
const PAL = ['#ff5a1f', '#ff5a1f', '#ff8a4c', '#ffb48a', '#ffe0cc', '#ffffff']
function Intro({ out, onBurst }) {
  const ref = useRef(), outR = useRef(out)
  useEffect(() => { outR.current = out }, [out])
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    const dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight
    cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr)
    let raf, alive = true, P = [], t0 = 0, ts = 0, burst = false
    const cx = W / 2, cy = H / 2
    const build = () => {
      const off = document.createElement('canvas'); off.width = W; off.height = H
      const o = off.getContext('2d'), F = (s) => `900 ${s}px Archivo, system-ui, sans-serif`
      o.font = F(100)
      let fs = Math.min(100 * (W * 0.84) / o.measureText('RAHUL').width, H * 0.34)
      o.font = F(fs); o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff'
      o.fillText('RAHUL', cx, cy * 0.92)
      const step = Math.max(5, Math.round(fs / 26)), d = o.getImageData(0, 0, W, H).data
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
        if (d[(y * W + x) * 4 + 3] > 140) {
          const a = Math.random() * 6.283, r = Math.max(W, H) * (0.75 + Math.random() * 0.6)
          const dist = Math.hypot(x - cx, y - cy) + 1
          P.push({ tx: x, ty: y, sx: cx + Math.cos(a) * r, sy: cy + Math.sin(a) * r, dl: Math.random() * 0.5,
            g: GLY[(Math.random() * GLY.length) | 0], c: PAL[(Math.random() * PAL.length) | 0],
            vx: (x - cx) / dist * (260 + Math.random() * 760) + (Math.random() - 0.5) * 220,
            vy: (y - cy) / dist * (260 + Math.random() * 760) + (Math.random() - 0.5) * 220, rs: (Math.random() - 0.5) * 14, sp: Math.random() * 6 })
        }
      }
      return { gs: Math.max(8, step * 1.3), sub: Math.max(11, Math.min(20, fs / 9)), subY: cy * 0.92 + fs * 0.62 }
    }
    const start = (m) => {
      t0 = performance.now()
      const frame = (now) => {
        if (!alive) return
        const t = (now - t0) / 1000
        if (outR.current && !ts) ts = now
        const u = ts ? (now - ts) / 1000 : 0
        if (ts) ctx.clearRect(0, 0, W, H); else { ctx.fillStyle = 'rgba(23,7,5,.3)'; ctx.fillRect(0, 0, W, H) }
        ctx.globalCompositeOperation = 'lighter'
        ctx.font = `700 ${m.gs}px ui-monospace, Consolas, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        for (const p of P) {
          let x, y, al = 1, rot = 0
          if (ts) {
            x = p.tx + p.vx * u; y = p.ty + p.vy * u + 420 * u * u; al = Math.max(0, 1 - u / 0.8); rot = p.rs * u
          } else {
            const k = Math.min(1, Math.max(0, (t - p.dl) / 1.1)), e = 1 - Math.pow(1 - k, 4), s = 1 - e
            const rx = p.tx + (p.sx - p.tx) * s - cx, ry = p.ty + (p.sy - p.ty) * s - cy, an = s * 1.7
            x = cx + rx * Math.cos(an) - ry * Math.sin(an); y = cy + rx * Math.sin(an) + ry * Math.cos(an)
            al = Math.min(1, k * 3) * (k >= 1 ? 0.8 + 0.2 * Math.sin(t * 7 + p.sp) : 1); rot = s * 6
          }
          ctx.globalAlpha = al; ctx.fillStyle = p.c
          if (rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillText(p.g, 0, 0); ctx.restore() } else ctx.fillText(p.g, x, y)
        }
        const sa = ts ? Math.max(0, 1 - u / 0.5) : Math.min(1, Math.max(0, (t - 1.35) / 0.5))
        if (sa > 0) {
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = sa * 0.9; ctx.fillStyle = '#ffb48a'
          ctx.font = `600 ${m.sub}px Archivo, system-ui, sans-serif`
          if ('letterSpacing' in ctx) ctx.letterSpacing = '0.4em'
          ctx.fillText('SOFTWARE ENGINEER', cx, m.subY); if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
        if (!ts && !burst && t > 2) { burst = true; onBurst() }
        if (ts && u > 1) return
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    }
    Promise.race([document.fonts.load('900 100px Archivo'), new Promise((r) => setTimeout(r, 500))]).then(() => alive && start(build()))
    return () => { alive = false; cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} />
}


export default function App() {
  const [out, setOut] = useState(false), [gone, setGone] = useState(false), [menu, setMenu] = useState(false)
  const isMobile = useMedia('(max-width: 820px)')

  // symbols assemble into RAHUL (~2s), then shatter to reveal the hero
  const done = useRef(false)
  const reveal = () => {
    if (done.current) return
    done.current = true
    setOut(true)
    setTimeout(() => document.body.classList.add('ready'), 200)
    setTimeout(() => setGone(true), 1100)
  }
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(reveal, reduce ? 0 : 4000) // safety net; the canvas normally triggers it at ~2s
    return () => clearTimeout(t)
  }, [])
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc)
  }, [menu])
  // close the mobile menu if the screen grows to desktop
  useEffect(() => { if (!isMobile) setMenu(false) }, [isMobile])

  const words = Object.values(SK).join(', ').split(', ').slice(0, 18).join(' ✦ ') + ' ✦ '

  return (
    <>
      {!gone && (
        <div className={`greet ${out ? 'out' : ''}`}>
          <Intro out={out} onBurst={reveal} />
          <button className="skip up" onClick={reveal}>Skip</button>
        </div>
      )}
      <Scene />

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <b>Rahul®</b>

        {/* Desktop links: always visible on large screens */}
        <div
          className="up"
          style={isMobile
            ? { display: 'none' }
            : { display: 'flex', alignItems: 'center', gap: 24, position: 'static', opacity: 1, visibility: 'visible', transform: 'none' }}
        >
          {NAV.map(([id, n]) => <a key={id} href={`#${id}`}>{n}</a>)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Resume button at the top */}
          <a href={RESUME} target="_blank" rel="noopener noreferrer" download="Rahul_Patra_Resume.pdf" style={resumeBtn}>
            Resume ↓
          </a>
          {/* Hamburger only on mobile */}
          <button
            className="bars"
            aria-label="Menu"
            onClick={() => setMenu(!menu)}
            style={isMobile ? { display: 'block' } : { display: 'none' }}
          />
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`menu up ${menu ? 'open' : ''}`}
        style={isMobile ? undefined : { display: 'none' }}
        onClick={(e) => e.target.closest('a') && setMenu(false)}
      >
        {NAV.map(([id, n]) => <a key={id} href={`#${id}`}>{n}</a>)}
        <a href={RESUME} target="_blank" rel="noopener noreferrer" download="Rahul_Patra_Resume.pdf">Resume ↓</a>
      </div>

      <header className="hero sec" id="top">

        <p className="intro up">I build full-stack products and AI-integrated software that are fast, secure and impactful</p>
        <a className="thumb" href={CP} target="_blank" rel="noopener noreferrer" aria-label="Visit CorePilot">
          <p className="up"><span>CorePilot</span><span>AI Dev Tools ↗</span></p>
        </a>
        <div className="big up"><small>©2026</small><h1>Rahul</h1></div>
        <a className="talk" href="#contact"><span className="av">RP</span><div><small className="up">Let’s talk</small><br /><b>Rahul Patra</b><br /><small>Software Engineer</small></div><span className="ar">↗</span></a>
      </header>

      <section className="sec" id="about">
        <p className="lab up">(01) About</p><h2>Code, <em>craft</em> &amp; AI</h2>
        <div className="about">
          <div>
            <p>Software Engineer with hands-on experience building production full-stack applications, scalable REST APIs and AI-integrated software. Founder of CorePilot, an AI developer-tooling SaaS built on LLMs and Retrieval-Augmented Generation. Comfortable across backend engineering, authentication, database optimization, CI/CD and end-to-end delivery.</p>
            <p className="edu">B.Tech, Electronics &amp; Telecommunication Engineering<br />Veer Surendra Sai University of Technology, Burla · Expected May 2028<br />Campus Ambassador, E-Cell IIT Bombay (2024–25)</p>
          </div>
          <div className="stats">{[['8.87', 'CGPA / 10'], ['100+', 'LeetCode solved'], ['30%', 'Faster UI delivery'], ['4+', 'Full-stack products']].map(([a, b]) => <div key={b}><strong>{a}</strong><span className="up">{b}</span></div>)}</div>
        </div>
      </section>

      <section className="sec or" id="skills">
        <p className="lab up">(02) Skills</p><h2>The <em>toolkit</em></h2>
        <div className="mq"><div><span>{words}</span><span>{words}</span></div></div>
        <div className="sk">{Object.entries(SK).map(([k, v]) => <div key={k}><h4 className="up">{k}</h4><p>{v}</p></div>)}</div>
      </section>

      <section className="sec" id="work">
        <p className="lab up">(03) Experience</p><h2>Where I’ve <em>shipped</em></h2>
        {J.map((j) => (
          <div className="job" key={j.role}>
            <div className="yr">{j.when}</div>
            <div><h3>{j.t}</h3><p className="rl up">{j.role}</p><ul>{j.pts.map((p, k) => <li key={k}>{p}</li>)}</ul></div>
          </div>
        ))}
      </section>

        <section className="sec or" id="projects">
        <p className="lab up">(04) Projects</p><h2>Selected <em>work</em></h2>
        {P.map((p, k) =>
          true /* details always visible inside the scene panel */ ? (
            /* Mobile: details always visible, no hover needed */
            <div
              key={p[0]}
              style={{ display: 'block', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,.35)' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>0{k + 1}</span>
                <h3 style={{ margin: 0, fontSize: 'clamp(24px, 7vw, 34px)', lineHeight: 1.05 }}>{p[0]}</h3>
              </div>

              <p style={{
                display: 'block', position: 'static', opacity: 1, visibility: 'visible',
                transform: 'none', height: 'auto', maxHeight: 'none', width: 'auto',
                margin: '14px 0 0', fontSize: 15, lineHeight: 1.6,
              }}>
                {p[1]}
              </p>

              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', opacity: 0.85 }}>
                {p[2]}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                <a
                  href={p[4]} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999, border: '1px solid currentColor', color: 'inherit', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                >
                  <FaGithub /> GitHub
                </a>
                <a
                  href={p[3]} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999, border: '1px solid currentColor', color: 'inherit', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}
                >
                  Live ↗
                </a>
              </div>
            </div>
          ) : (
            /* Desktop: your original hover layout */
            <div className="pr" key={p[0]}>
              <span className="n up">0{k + 1}</span><h3>{p[0]}</h3>
              <p>
                {p[1]}<small className="up">{p[2]}</small>
                <small className="buttom" onClick={() => window.open(p[4], '_blank')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaGithub />GitHub</span>
                </small>
              </p>
              <span className="ar2" onClick={() => window.open(p[3], '_blank')}>↗</span>
            </div>
          )
        )}
      </section>

      <section className="sec ct" id="contact">
        <p className="lab up">(05) Contact</p><h2>Let’s <em>talk</em></h2>
        <a className="mail" href={`mailto:${MAIL}`}>{MAIL}</a>
        <div className="soc up">
          <a href="https://github.com/patraRahul5678" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/rahulfullstackpatra" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://leetcode.com/u/kanha8920/" target="_blank" rel="noreferrer">LeetCode</a>
          <a href="tel:+918984918920">+91 89849 18920</a>
        </div>
        <footer className="up">©2026 Rahul Patra · Bargarh, Odisha, India</footer>
      </section>
    </>
  )
}