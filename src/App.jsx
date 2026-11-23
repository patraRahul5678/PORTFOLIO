import { useEffect, useRef, useState } from 'react'
import Model from './Models.jsx'
import { FaGithub } from 'react-icons/fa';

const G = [['Hello', 'en'], ['नमस्ते', 'hi'], ['ନମସ୍କାର', 'or'], ['Hola', 'es'], ['Bonjour', 'fr'], ['こんにちは', 'ja'], ['Hallo', 'de'], ['你好', 'zh'], ['I’m Rahul.', 'en']]
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

function Cursor() {
  const dotR = useRef(), ringR = useRef()
  useEffect(() => {
    if (matchMedia('(hover:none),(pointer:coarse)').matches) return
    const ring = ringR.current, dot = dotR.current
    const gh = document.querySelector('.ghost'), me = document.querySelector('.me')
    let x = 0, y = 0, rx = 0, ry = 0, lt = 0, raf
    const mv = (e) => {
      x = e.clientX; y = e.clientY
      dot.style.transform = `translate(${x}px,${y}px)`
      const px = x / innerWidth - 0.5, py = y / innerHeight - 0.5
      if (gh) gh.style.transform = `translateX(calc(-50% + ${px * -40}px)) translateY(${py * -20}px)`
      if (me) me.style.transform = `translateX(calc(-50% + ${px * 18}px))`
      const n = performance.now()
      if (n - lt > 50) {
        lt = n
        const s = document.createElement('i')
        s.className = 'spark'; s.style.left = x + 'px'; s.style.top = y + 'px'
        s.style.setProperty('--dx', (Math.random() - 0.5) * 36 + 'px'); s.style.setProperty('--dy', (Math.random() - 0.5) * 36 + 'px')
        document.body.appendChild(s); setTimeout(() => s.remove(), 700)
      }
    }
    const ov = (e) => ring.classList.toggle('hot', !!e.target.closest('a,button,.pr,.sk div'))
    const loop = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop) }
    addEventListener('mousemove', mv); addEventListener('mouseover', ov); loop()
    return () => { removeEventListener('mousemove', mv); removeEventListener('mouseover', ov); cancelAnimationFrame(raf) }
  }, [])
  return (<><div className="ring" ref={ringR} /><div className="dot" ref={dotR} /></>)
}

export default function App() {
  const [i, setI] = useState(0), [x, setX] = useState(false), [off, setOff] = useState(false), [gone, setGone] = useState(false), [menu, setMenu] = useState(false)
  const isMobile = useMedia('(max-width: 820px)')

  const finish = () => {
    setOff(true)
    setTimeout(() => document.body.classList.add('ready'), 350)
    setTimeout(() => setGone(true), 1500)
  }
  useEffect(() => {
    if (off) return
    const last = i === G.length - 1
    const t = setTimeout(() => {
      if (last) return finish()
      setX(true)
      setTimeout(() => { setI((v) => v + 1); setX(false) }, 300)
    }, last ? 1400 : 700)
    return () => clearTimeout(t)
  }, [i, off])
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
        <div className={`greet ${off ? 'off' : ''}`}>
          <h1 className={`gw ${x ? 'x' : ''}`} lang={G[i][1]}>{G[i][0]}</h1>
          <button className="skip up" onClick={finish}>Skip intro</button>
        </div>
      )}
      <Cursor />

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

      <header className="hero" id="top">
        <svg className="lines" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#ffd2a8" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
          <path d="M-50 330 C300 280 520 120 1000 -20" /><path d="M-50 380 C320 340 600 180 1100 -40" style={{ animationDelay: '-2s' }} />
          <path d="M500 880 C900 700 1200 600 1500 380" style={{ animationDelay: '-4s' }} /><path d="M700 880 C1000 760 1300 700 1500 520" />
        </svg>
        <div className="grid" />
        <div className="ghost">RAHUL</div>

        {/* Image wrapper: keeps proportions on small screens */}
        <div
          className="me"
          style={isMobile ? { width: 'min(78vw, 360px)', height: 'auto', maxHeight: '68vh' } : undefined}
        >
          <img
            src="/photo.png"
            alt="Rahul Patra"
            style={{
              display: 'block',
              width: '100%',
              height: isMobile ? 'auto' : '100%',
              maxHeight: isMobile ? '68vh' : undefined,
              objectFit: 'contain',
              objectPosition: 'center bottom',
            }}
          />
        </div>

        <p className="intro up">I build full-stack products and AI-integrated software that are fast, secure and impactful</p>
        <a className="thumb" href={CP} target="_blank" rel="noopener noreferrer" aria-label="Visit CorePilot">
          <div className="tc"><Model kind="crystal" /></div>
          <p className="up"><span>CorePilot</span><span>AI Dev Tools ↗</span></p>
        </a>
        <div className="big up"><small>©2026</small><h1>Rahul</h1></div>
        <a className="talk" href="#contact"><span className="av">RP</span><div><small className="up">Let’s talk</small><br /><b>Rahul Patra</b><br /><small>Software Engineer</small></div><span className="ar">↗</span></a>
      </header>

      <section className="sec" id="about">
        <div className="m3d"><Model kind="knot" /></div>
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
          isMobile ? (
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