import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';

const CLUSTERS = {
  work: {
    label: 'Work Experience',
    color: '#1a8b9d',
    glow: 'rgba(26,139,157,0.6)',
    nodes: ['Software Dev', 'UI Design', 'Embedded Sys', 'Freelance'],
  },
  hobbies: {
    label: 'Hobbies',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.6)',
    nodes: ['Sewing', 'YouTube', 'Sketching', 'Photography'],
  },
  uni: {
    label: 'Uni Interests',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.6)',
    nodes: ['Computer Sci', 'AI / ML', 'Architecture', 'HCI'],
  },
  personal: {
    label: 'Personal',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.6)',
    nodes: ['Botswana', 'UK Life', 'Community', 'Travel'],
  },
};

function buildGraph(width, height) {
  const nodes = [];
  const edges = [];
  const clusterKeys = Object.keys(CLUSTERS);

  // Place cluster centres evenly around the canvas
  const centres = [
    { x: width * 0.28, y: height * 0.3 },
    { x: width * 0.72, y: height * 0.3 },
    { x: width * 0.28, y: height * 0.7 },
    { x: width * 0.72, y: height * 0.7 },
  ];

  clusterKeys.forEach((key, ci) => {
    const cluster = CLUSTERS[key];
    const cx = centres[ci].x;
    const cy = centres[ci].y;

    // Hub node
    const hubIdx = nodes.length;
    nodes.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      label: cluster.label,
      color: cluster.color,
      glow: cluster.glow,
      radius: 14,
      cluster: key,
      isHub: true,
    });

    cluster.nodes.forEach((label) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 50;
      const idx = nodes.length;
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        label,
        color: cluster.color,
        glow: cluster.glow,
        radius: 8,
        cluster: key,
        isHub: false,
      });
      edges.push({ from: hubIdx, to: idx });
    });
  });

  // Cross-cluster edges (a few)
  const hubs = nodes.filter((n) => n.isHub).map((n) => nodes.indexOf(n));
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      if (Math.random() < 0.6) edges.push({ from: hubs[i], to: hubs[j] });
    }
  }

  return { nodes, edges };
}

export default function MyGraph() {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      graphRef.current = buildGraph(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { nodes, edges } = graphRef.current;
      const { width, height } = canvas;
      const mouse = mouseRef.current;

      // Find hovered node
      let hoveredIdx = -1;
      let minDist = Infinity;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < n.radius + 8 && d < minDist) {
          minDist = d;
          hoveredIdx = i;
        }
      });

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(0, 0, width, height);

      // Grid dots
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let gx = 0; gx < width; gx += 30) {
        for (let gy = 0; gy < height; gy += 30) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Edges
      edges.forEach(({ from, to }) => {
        const a = nodes[from];
        const b = nodes[to];
        const isHighlighted = hoveredIdx === from || hoveredIdx === to;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isHighlighted
          ? `${a.color}88`
          : 'rgba(255,255,255,0.07)';
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n, i) => {
        const isHovered = i === hoveredIdx;

        // Glow
        if (isHovered || n.isHub) {
          const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3);
          grad.addColorStop(0, n.glow);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? n.radius + 3 : n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.glow;
        ctx.shadowBlur = isHovered ? 20 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label (always for hubs, hover for others)
        if (n.isHub || isHovered) {
          ctx.font = n.isHub ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
          ctx.fillStyle = n.isHub ? '#ffffff' : 'rgba(255,255,255,0.85)';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + n.radius + 14);
        }

        // Gentle float animation
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < n.radius || n.x > width - n.radius) n.vx *= -1;
        if (n.y < n.radius || n.y > height - n.radius) n.vy *= -1;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div className="page-container" style={{ background: '#0d1117' }}>
      <Navbar dark />
      <main className="graph-main">
        <div className="graph-header">
          <p className="about-eyebrow" style={{ color: '#1a8b9d' }}>Knowledge Graph</p>
          <h1 className="about-title" style={{ color: '#e6edf3' }}>My World, Connected</h1>
          <p className="about-subtitle" style={{ color: 'rgba(230,237,243,0.5)' }}>
            Hover over nodes to explore my interests, experience, and passions.
          </p>
        </div>

        {/* Legend */}
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
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 }; }}
        />
      </main>
    </div>
  );
}
