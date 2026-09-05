import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── Data ──────────────────────────────────────────────── */

const ROLES = ['creative engineer', 'Visual Communicator', 'Researcher', 'Animator', 'Filmmaker'];

const CARDS = [
  { icon: '👋', title: 'Who I Am',       body: "I'm Amantle — a creative engineer living in the UK with roots in Botswana. I blend technical rigour with artistic flair.", gradient: 'linear-gradient(135deg, rgba(26,139,157,0.15), rgba(26,139,157,0.03))', border: 'rgba(26,139,157,0.3)' },
  { icon: '💻', title: 'What I Do',      body: 'I design and build digital experiences — from embedded systems to slick web interfaces. Engineering is my canvas.',          gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.03))', border: 'rgba(139,92,246,0.3)' },
  { icon: '🧵', title: 'Seamstress',     body: 'Fashion and fabric are a passion. I design and sew my own pieces — every stitch is intentional.',                            gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.03))', border: 'rgba(236,72,153,0.3)' },
  { icon: '🎥', title: 'YouTuber',       body: 'I document my creative process and share perspectives from my unique journey. Content that connects.',                        gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.03))', border: 'rgba(245,158,11,0.3)' },
  { icon: '🎓', title: 'Student',        body: '— TODO: Add your degree, university, and what you\'re studying here.',                                                       gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.03))', border: 'rgba(16,185,129,0.3)' },
  { icon: '🌍', title: 'Botswana → UK', body: 'Two worlds, one perspective. Growing up in Botswana and building a career in the UK shapes everything I create.',             gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.03))', border: 'rgba(59,130,246,0.3)' },
];

const CLUSTERS = {
  work:     { label: 'Work Experience', color: '#1a8b9d', glow: 'rgba(26,139,157,0.6)',  nodes: ['Software Dev', 'UI Design', 'Embedded Sys', 'Freelance'] },
  hobbies:  { label: 'Hobbies',         color: '#a855f7', glow: 'rgba(168,85,247,0.6)',  nodes: ['Sewing', 'YouTube', 'Sketching', 'Photography'] },
  uni:      { label: 'Uni Interests',   color: '#f59e0b', glow: 'rgba(245,158,11,0.6)',  nodes: ['Computer Sci', 'AI / ML', 'Architecture', 'HCI'] },
  personal: { label: 'Personal',        color: '#ec4899', glow: 'rgba(236,72,153,0.6)',  nodes: ['Botswana', 'UK Life', 'Community', 'Travel'] },
};

/* ─── Graph helpers ─────────────────────────────────────── */

function buildGraph(w, h) {
  const nodes = [], edges = [];
  const keys = Object.keys(CLUSTERS);
  const centres = [
    { x: w * 0.28, y: h * 0.3 }, { x: w * 0.72, y: h * 0.3 },
    { x: w * 0.28, y: h * 0.7 }, { x: w * 0.72, y: h * 0.7 },
  ];

  keys.forEach((key, ci) => {
    const c = CLUSTERS[key];
    const { x: cx, y: cy } = centres[ci];
    const hubIdx = nodes.length;
    nodes.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, label: c.label, color: c.color, glow: c.glow, radius: 14, isHub: true });
    c.nodes.forEach(label => {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 70 + Math.random() * 50;
      const idx   = nodes.length;
      nodes.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, label, color: c.color, glow: c.glow, radius: 8, isHub: false });
      edges.push({ from: hubIdx, to: idx });
    });
  });

  const hubs = nodes.reduce((acc, n, i) => (n.isHub ? [...acc, i] : acc), []);
  for (let i = 0; i < hubs.length; i++)
    for (let j = i + 1; j < hubs.length; j++)
      if (Math.random() < 0.6) edges.push({ from: hubs[i], to: hubs[j] });

  return { nodes, edges };
}

/* ─── Component ─────────────────────────────────────────── */

export default function Home() {
  const canvasRef = useRef(null);
  const graphRef  = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      graphRef.current = buildGraph(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!graphRef.current) return;
      const { nodes, edges } = graphRef.current;
      const { width, height } = canvas;
      const mouse = mouseRef.current;

      let hoveredIdx = -1, minDist = Infinity;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < n.radius + 8 && d < minDist) { minDist = d; hoveredIdx = i; }
      });

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, width, height);

      // Grid dots
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let gx = 0; gx < width; gx += 30)
        for (let gy = 0; gy < height; gy += 30) {
          ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill();
        }

      // Edges
      edges.forEach(({ from, to }) => {
        const a = nodes[from], b = nodes[to];
        const hi = hoveredIdx === from || hoveredIdx === to;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hi ? `${a.color}88` : 'rgba(255,255,255,0.07)';
        ctx.lineWidth   = hi ? 1.5 : 0.8;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n, i) => {
        const hovered = i === hoveredIdx;
        if (hovered || n.isHub) {
          const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3);
          gr.addColorStop(0, n.glow); gr.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gr; ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, hovered ? n.radius + 3 : n.radius, 0, Math.PI * 2);
        ctx.fillStyle  = n.color;
        ctx.shadowColor = n.glow;
        ctx.shadowBlur  = hovered ? 20 : 8;
        ctx.fill();
        ctx.shadowBlur  = 0;

        if (n.isHub || hovered) {
          ctx.font      = n.isHub ? 'bold 11px Inter,sans-serif' : '10px Inter,sans-serif';
          ctx.fillStyle = n.isHub ? '#fff' : 'rgba(255,255,255,0.85)';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + n.radius + 14);
        }

        n.x += n.vx; n.y += n.vy;
        if (n.x < n.radius || n.x > width  - n.radius) n.vx *= -1;
        if (n.y < n.radius || n.y > height - n.radius) n.vy *= -1;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="sp-root">
      {/* ── Sticky navbar ── */}
      <Navbar anchored />

      {/* ══════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════ */}
      <section id="home" className="sp-hero">
        <div className="hero-content">
          <p className="hero-greeting">Hi! I'm Amantle <span className="sparkle-icon">✺</span></p>
          <h1 className="hero-title">
            I am a
            <div className="scrolling-words-container">
              <ul className="scrolling-words">
                {ROLES.map((r, i) => <li key={i}>{r}</li>)}
                <li aria-hidden="true">{ROLES[0]}</li>
              </ul>
            </div>
          </h1>
          <a href="#about" className="sp-scroll-hint">scroll ↓</a>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 2 — ABOUT
      ══════════════════════════════ */}
      <section id="about" className="sp-about">
        <div className="about-header">
          <p className="about-eyebrow">Get to know me</p>
          <h2 className="about-title">A little about Amantle</h2>
          <p className="about-subtitle">Designer, engineer, creator — placeholder cards until you fill them in.</p>
        </div>
        <div className="cards-grid">
          {CARDS.map((card, i) => (
            <div key={i} className="glass-card" style={{ background: card.gradient, borderColor: card.border }}>
              <span className="glass-card-icon">{card.icon}</span>
              <h3 className="glass-card-title">{card.title}</h3>
              <p className="glass-card-body">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 3 — GRAPH
      ══════════════════════════════ */}
      <section id="graph" className="sp-graph">
        <div className="graph-header">
          <p className="about-eyebrow" style={{ color: '#1a8b9d' }}>Knowledge Graph</p>
          <h2 className="about-title" style={{ color: '#e6edf3' }}>My World, Connected</h2>
          <p className="about-subtitle" style={{ color: 'rgba(230,237,243,0.5)' }}>
            Hover over nodes to explore my interests, experience, and passions.
          </p>
        </div>
        <div className="graph-legend">
          {Object.entries(CLUSTERS).map(([key, c]) => (
            <div key={key} className="legend-item">
              <span className="legend-dot" style={{ background: c.color, boxShadow: `0 0 8px ${c.glow}` }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{c.label}</span>
            </div>
          ))}
        </div>
        <canvas
          ref={canvasRef}
          className="graph-canvas"
          onMouseMove={e => {
            const r = canvasRef.current.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          }}
          onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
        />
      </section>

      <Footer />
    </div>
  );
}
