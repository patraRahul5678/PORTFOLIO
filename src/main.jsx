import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const DATA = {
  name: 'Rahul Patra',
  tagline: 'Full-Stack & AI Software Engineer',
  initials: 'RP',
  about: {
    bio: 'Software Engineer with a strong computer science foundation in data structures, algorithms, object-oriented design, systems design, and software engineering fundamentals — combined with hands-on experience shipping production full-stack and AI-integrated applications. Founder of CorePilot, a developer tooling platform in active development, and currently a Full-Stack & AI Integration intern at Smartnex Technologies. Comfortable learning unfamiliar codebases and new languages quickly, with demonstrated ability to independently design, test, and ship production-grade software end to end.',
    tags: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'LLM Integration', 'System Design']
  },
  projects: [
    { name: 'CorePilot', stack: 'React · Node · MongoDB · LLM Orchestration · RAG', desc: 'AI-powered developer tooling platform applying LLM orchestration and Retrieval-Augmented Generation to automate context discovery and surface real-time engineering insights. Sole engineer, from architecture through deployment.', link: 'https://corepilot.online' },
    { name: 'CodeLens', stack: 'React.js · Node.js · MongoDB · Gemini API · Prompt Engineering', desc: 'AI-powered code review platform integrating the Gemini API with custom prompt engineering to generate bug reports, quality scores, and fix suggestions — cutting manual review workload by ~40%.', link: '#' },
    { name: 'Connectra', stack: 'React.js · Node.js · MongoDB · WebSockets · JWT · RBAC', desc: 'Real-time communication platform with a low-latency WebSocket messaging layer, JWT authentication, and role-based access control for secure, synchronized sessions.', link: '#' },
    { name: 'Leave Management System', stack: 'React.js · Node.js · Express.js · MongoDB · JWT · RBAC', desc: 'Full-stack leave management platform for employees to apply and track requests, with JWT auth, RBAC, and RESTful APIs powering approval workflows for admins.', link: '#' }
  ],
  skills: {
    Languages: ['Java', 'JavaScript (ES6+)', 'TypeScript', 'Python', 'C', 'C++', 'SQL'],
    Frontend: ['React.js', 'React Native', 'Next.js', 'Tailwind CSS', 'HTML5/CSS3'],
    'Backend & APIs': ['Node.js', 'Express.js', 'RESTful APIs', 'GraphQL', 'WebSockets', 'JWT / OAuth 2.0'],
    'Data & Cloud': ['MongoDB', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'CI/CD (GitHub Actions)'],
    'AI & LLM': ['LLM Integration (Gemini, OpenAI, Claude, Llama)', 'Prompt Engineering', 'RAG']
  },
  experience: [
    { role: 'Founder & Lead AI Software Engineer', org: 'CorePilot', period: 'Jan 2026 — Present', points: ['Architecting a full-stack developer tooling platform using LLM orchestration and RAG to automate context discovery and surface real-time engineering insights', 'Owning end-to-end systems design, backend APIs, testing, and deployment as the sole engineer, including authentication, tenant isolation, and data security'] },
    { role: 'Software Engineer Intern — Full-Stack & AI Integration', org: 'Smartnex Technologies Pvt. Ltd.', period: 'Dec 2024 — Present', points: ['Integrated AI-assisted features into production MERN modules across 5+ product areas', 'Built reusable React.js component libraries, boosting development efficiency by 30% and cutting UI redundancy by 25%', 'Implemented JWT authentication and RBAC to enforce secure, multi-role access in production', 'Optimized MongoDB queries and data pipelines, improving API reliability and throughput'] }
  ],
  education: [
    { degree: 'B.Tech — Electronics and Telecommunication Engineering', school: 'Veer Surendra Sai University of Technology, Burla', period: 'Expected May 2028 · CGPA 8.97 / 10.0' }
  ],
  contact: {
    email: 'kanhapatra801@gmail.com',
    links: [
      { label: 'GitHub', url: 'https://github.com/patraRahul5678' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/rahulfullstackpatra' },
      { label: 'LeetCode', url: 'https://leetcode.com/u/kanha8920/' }
    ]
  }
};

const SECTION_META = {
  about: { title: 'About Me', eyebrow: 'Ke1 – e3', short: 'About' },
  projects: { title: 'Projects', eyebrow: 'Qd1 – d5', short: 'Projects' },
  skills: { title: 'Skills', eyebrow: 'Nb1 – c3', short: 'Skills' },
  experience: { title: 'Experience', eyebrow: 'Bc8 – g4', short: 'Experience' },
  education: { title: 'Education', eyebrow: 'Ra8 – a5', short: 'Education' },
  contact: { title: 'Contact', eyebrow: 'e7 – e5', short: 'Contact' }
};

const PIECES = [
  { id: 'b-r-a8', file: 0, rank: 8, symbol: '♜', color: 'black', interactive: true, dest: { file: 0, rank: 5 }, notation: 'Ra8–a5', section: 'education', moveType: 'line' },
  { id: 'b-n-b8', file: 1, rank: 8, symbol: '♞', color: 'black' },
  { id: 'b-b-c8', file: 2, rank: 8, symbol: '♝', color: 'black', interactive: true, dest: { file: 6, rank: 4 }, notation: 'Bc8–g4', section: 'experience', moveType: 'line' },
  { id: 'b-q-d8', file: 3, rank: 8, symbol: '♛', color: 'black' },
  { id: 'b-k-e8', file: 4, rank: 8, symbol: '♚', color: 'black' },
  { id: 'b-b-f8', file: 5, rank: 8, symbol: '♝', color: 'black' },
  { id: 'b-n-g8', file: 6, rank: 8, symbol: '♞', color: 'black' },
  { id: 'b-r-h8', file: 7, rank: 8, symbol: '♜', color: 'black' },
  ...[0, 1, 2, 3, 5, 6, 7].map((f) => ({ id: `b-p-${f}`, file: f, rank: 7, symbol: '♟', color: 'black' })),
  { id: 'p-e7', file: 4, rank: 7, symbol: '♟', color: 'black', interactive: true, dest: { file: 4, rank: 5 }, notation: 'e7–e5', section: 'contact', moveType: 'line' },
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((f) => ({ id: `w-p-${f}`, file: f, rank: 2, symbol: '♙', color: 'white' })),
  { id: 'r-a1', file: 0, rank: 1, symbol: '♖', color: 'white' },
  { id: 'n-b1', file: 1, rank: 1, symbol: '♘', color: 'white', interactive: true, dest: { file: 2, rank: 3 }, notation: 'Nb1–c3', section: 'skills', moveType: 'knight' },
  { id: 'b-c1', file: 2, rank: 1, symbol: '♗', color: 'white' },
  { id: 'q-d1', file: 3, rank: 1, symbol: '♕', color: 'white', interactive: true, dest: { file: 3, rank: 5 }, notation: 'Qd1–d5', section: 'projects', moveType: 'line' },
  { id: 'k-e1', file: 4, rank: 1, symbol: '♔', color: 'white', interactive: true, dest: { file: 4, rank: 3 }, notation: 'Ke1–e3', section: 'about', moveType: 'line' },
  { id: 'w-b-f1', file: 5, rank: 1, symbol: '♗', color: 'white' },
  { id: 'w-n-g1', file: 6, rank: 1, symbol: '♘', color: 'white' },
  { id: 'w-r-h1', file: 7, rank: 1, symbol: '♖', color: 'white' }
];

const INTERACTIVE_IDS = PIECES.filter((p) => p.interactive).map((p) => p.id);
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const hints = ['setting up the board…', 'placing the pieces…', 'polishing the brass…', 'chalking the squares…', 'waking the knight…', 'almost ready…'];
const floaterGlyphs = ['♟', '♙', '♞', '♘', '♝', '♗', '♜', '♖', '♛', '♕'];

const pos = (file, rank) => ({ left: file * 12.5, top: (8 - rank) * 12.5 });

function Splash({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState('setting up the board…');
  const [tagline, setTagline] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [spin, setSpin] = useState(false);
  const [floaters] = useState(() => Array.from({ length: 16 }, (_, i) => {
    const size = 12 + Math.random() * 22;
    const dur = 13 + Math.random() * 15;
    return {
      id: i,
      glyph: floaterGlyphs[Math.floor(Math.random() * floaterGlyphs.length)],
      left: `${Math.random() * 100}%`,
      fontSize: `${size}px`,
      animationDuration: `${dur}s`,
      animationDelay: `-${Math.random() * dur}s`
    };
  }));
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < 8) {
        setProgress(i + 1);
        setHint(hints[Math.min(i, hints.length - 1)]);
        i += 1;
      } else {
        clearInterval(interval);
        setHint("ready — enter when you're ready…");
      }
    }, 190);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;
    const text = DATA.tagline;
    const interval = setInterval(() => {
      setTagline(text.slice(0, i + 1));
      i += 1;
      if (i >= text.length) clearInterval(interval);
    }, 26);
    return () => clearInterval(interval);
  }, []);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 850);
  };

  return (
    <section className={`splash ${leaving ? 'leaving' : ''}`} onMouseMove={(e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setMouse({ x: (e.clientX / w - 0.5) * 18, y: (e.clientY / h - 0.5) * 18 });
    }}>
      <div className="splash-bg-pattern" aria-hidden="true" />
      <div className="splash-floaters" aria-hidden="true" style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}>
        {floaters.map((f) => <span key={f.id} className="floater" style={f}>{f.glyph}</span>)}
      </div>
      <div className="splash-inner">
        <button className={`splash-mark ${spin ? 'spin' : ''}`} type="button" aria-label="Tap for a little spin" onClick={() => {
          setSpin(false);
          requestAnimationFrame(() => setSpin(true));
        }}>♞</button>
        <h1 className="splash-name">{DATA.name}</h1>
        <p className={`splash-tag ${tagline.length === DATA.tagline.length ? 'done' : ''}`}>{tagline}</p>
        <div className="load-track">
          <div className="load-rail">
            <div className="load-piece" style={{ transform: `translateX(${Math.max(0, progress - 1) * 30}px) translateY(0)` }}>♙</div>
            <div className="load-squares">
              {Array.from({ length: 8 }, (_, i) => <span key={i} className={`ls ${i < progress ? 'on' : ''}`} />)}
            </div>
          </div>
        </div>
        <p className="splash-hint">{hint}</p>
        <div className="splash-actions">
          <button className="enter-btn" type="button" onClick={enter}>Enter the board ♟</button>
        </div>
      </div>
    </section>
  );
}

function Board({ onOpen }) {
  const [pieceState, setPieceState] = useState(() => Object.fromEntries(INTERACTIVE_IDS.map((id) => [id, 'home'])));
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState('');
  const [panelOrigin, setPanelOrigin] = useState(null);
  const pieceRefs = useRef({});

  const getPiece = (id) => PIECES.find((p) => p.id === id);

  const clearSelection = () => setSelectedId(null);

  const movePiece = (id) => {
    const p = getPiece(id);
    if (!p) return;
    setSelectedId(null);
    setPieceState((prev) => ({ ...prev, [id]: 'moving' }));
    setTimeout(() => {
      setPieceState((prev) => ({ ...prev, [id]: 'away' }));
      setToast(`${p.symbol}  ${p.notation}  ·  ${SECTION_META[p.section].title}`);
      setTimeout(() => setToast(''), 1800);
      setTimeout(() => onOpen(p.section, id, pieceRefs.current[id]), 500);
    }, 680);
  };

  const handlePieceClick = (id) => {
    const p = getPiece(id);
    if (!p) return;
    if (pieceState[id] === 'away') {
      onOpen(p.section, id, pieceRefs.current[id]);
      return;
    }
    if (selectedId === id) {
      clearSelection();
      return;
    }
    setSelectedId(id);
  };

  const reset = () => {
    clearSelection();
    setPieceState(Object.fromEntries(INTERACTIVE_IDS.map((id) => [id, 'home'])));
  };

  const trailKeys = useMemo(() => {
    if (!selectedId) return new Set();
    const p = getPiece(selectedId);
    if (!p || p.moveType !== 'line') return new Set();
    const result = new Set();
    const df = p.dest.file - p.file;
    const dr = p.dest.rank - p.rank;
    const steps = Math.max(Math.abs(df), Math.abs(dr));
    const stepF = df === 0 ? 0 : df / Math.abs(df);
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    for (let i = 1; i < steps; i++) result.add(`${p.file + stepF * i}-${p.rank + stepR * i}`);
    return result;
  }, [selectedId]);

  const done = Object.values(pieceState).filter((v) => v === 'away').length;

  return (
    <main className="stage visible">
      <header className="stage-header">
        <div className="brand"><span className="brand-mark">♞</span><span className="brand-name">{DATA.name}</span></div>
        <div className="stage-controls">
          <span className="progress-count">{done} / 6 explored</span>
          <button className="reset-btn" type="button" onClick={reset}>Reset board ↺</button>
        </div>
      </header>

      <div className="board-scene">
        <div className="file-labels top">{files.map((f) => <span key={f}>{f}</span>)}</div>
        <div className="rank-file-wrap">
          <div className="rank-labels">{Array.from({ length: 8 }, (_, i) => <span key={i}>{8 - i}</span>)}</div>
          <div className="board-wrap">
            <div className="board">
              {Array.from({ length: 8 }, (_, row) => 8 - row).flatMap((rank) =>
                files.map((_, file) => {
                  const key = `${file}-${rank}`;
                  const p = selectedId ? getPiece(selectedId) : null;
                  const target = p?.dest.file === file && p?.dest.rank === rank;
                  return <div key={key} className={`square ${((file + rank) % 2 === 1) ? 'light' : 'dark'} ${trailKeys.has(key) ? 'trail' : ''} ${target ? 'target' : ''}`} onClick={() => target && selectedId ? movePiece(selectedId) : clearSelection()} />;
                })
              )}
            </div>
            <div className="pieces-layer">
              {PIECES.map((p) => {
                const state = p.interactive ? pieceState[p.id] : 'home';
                const current = state === 'away' || state === 'moving' ? p.dest : { file: p.file, rank: p.rank };
                const c = pos(current.file, current.rank);
                return (
                  <div key={p.id} ref={(el) => { if (el) pieceRefs.current[p.id] = el; }} className={`piece ${p.color} ${p.interactive ? `interactive ${state === 'home' ? 'home' : ''} ${state === 'away' ? 'away' : ''} ${state === 'moving' ? 'moving' : ''} ${selectedId === p.id ? 'selected' : ''}` : 'decorative'}`} style={{ left: `${c.left}%`, top: `${c.top}%` }}>
                    {p.interactive ? (
                      <button className="piece-interaction" type="button" aria-label={`Move piece to open ${SECTION_META[p.section].title}`} onClick={() => handlePieceClick(p.id)}>{p.symbol}</button>
                    ) : p.symbol}
                    {p.interactive && <button className="section-badge" type="button" aria-label={`Jump directly to ${SECTION_META[p.section].title}`} onClick={(e) => { e.stopPropagation(); state === 'away' ? onOpen(p.section, p.id, pieceRefs.current[p.id]) : movePiece(p.id); }}>{SECTION_META[p.section].short}</button>}
                  </div>
                );
              })}
            </div>
            {toast && <div className="notation-toast show">{toast}</div>}
          </div>
        </div>
        <div className="file-labels bottom">{files.map((f) => <span key={f}>{f}</span>)}</div>
        <p className="hint-text">Tap a glowing piece, then tap the highlighted square to open that section — or tap its badge to jump straight there.</p>
      </div>
    </main>
  );
}

function PieceInteractionStyles() {
  return <style>{`.piece-interaction{font:inherit;color:inherit;background:none;border:none;padding:0;cursor:pointer;line-height:1}.piece-interaction:focus-visible{outline:2px solid var(--brass-bright);outline-offset:3px;border-radius:4px}`}</style>;
}

function Panel({ section, origin, onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  const body = () => {
    if (section === 'about') return <><div className="about-head"><div className="avatar">{DATA.initials}</div><div><strong style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>{DATA.name}</strong><br /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#7a6636' }}>{DATA.tagline}</span></div></div><p>{DATA.about.bio}</p><div className="tag-row">{DATA.about.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div></>;
    if (section === 'projects') return DATA.projects.map((pr) => <div className="card" key={pr.name}><h3>{pr.name}</h3><div className="meta">{pr.stack}</div><p style={{ margin: '0 0 8px' }}>{pr.desc}</p><a className="link" href={pr.link} target="_blank" rel="noopener noreferrer">View project →</a></div>);
    if (section === 'skills') return Object.entries(DATA.skills).map(([group, items]) => <div className="skill-group" key={group}><h4>{group}</h4><div className="tag-row">{items.map((i) => <span className="tag" key={i}>{i}</span>)}</div></div>);
    if (section === 'experience') return DATA.experience.map((x) => <div className="card" key={x.role}><h3>{x.role}</h3><div className="meta">{x.org} · {x.period}</div><ul>{x.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></div>);
    if (section === 'education') return DATA.education.map((x) => <div className="card" key={x.degree}><h3>{x.degree}</h3><div className="meta">{x.school} · {x.period}</div></div>);
    if (section === 'contact') return <><p>Checkmate? Let's connect — I'm always up for interesting problems.</p><p style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{DATA.contact.email}</p><div className="contact-links">{DATA.contact.links.map((l) => <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>)}</div></>;
    return null;
  };

  const meta = SECTION_META[section];
  return <div className="panel-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="panel" style={origin ? { '--origin-x': `${origin.left + origin.width / 2}px`, '--origin-y': `${origin.top + origin.height / 2}px` } : undefined} role="dialog" aria-modal="true" aria-labelledby="panelTitle">
      <button className="close-panel" type="button" onClick={onClose}>← Return to board</button>
      <p className="panel-eyebrow">{meta.eyebrow}</p>
      <h2 className="panel-title" id="panelTitle">{meta.title}</h2>
      <div className="panel-body">{body()}</div>
    </div>
  </div>;
}

function App() {
  const [entered, setEntered] = useState(false);
  const [panel, setPanel] = useState(null);

  const openSection = (key, pieceId, el) => {
    const rect = el?.getBoundingClientRect();
    setPanel({ key, pieceId, origin: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null });
  };

  return <>
    {!entered && <Splash onEnter={() => setEntered(true)} />}
    {entered && <Board onOpen={openSection} />}
    <PieceInteractionStyles />
    {panel && <Panel section={panel.key} origin={panel.origin} onClose={() => setPanel(null)} />}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
