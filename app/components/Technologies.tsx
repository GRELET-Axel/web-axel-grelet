"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Logo {
  src: string;
  name: string;
  category: "Frontend" | "Backend" | "DevOps" | "Cybersecurity";
}

const logos: Logo[] = [
  { src: "/logos/Angular.png", name: "Angular", category: "Frontend" },
  { src: "/logos/Apache.png", name: "Apache", category: "DevOps" },
  { src: "/logos/bash.png", name: "Bash", category: "DevOps" },
  { src: "/logos/burpsuite.jpg", name: "Burpsuite", category: "Cybersecurity" },
  { src: "/logos/C-CSharp.png", name: "CSharp", category: "Backend" },
  { src: "/logos/docker.png", name: "Docker", category: "DevOps" },
  { src: "/logos/ebios-rm.jpg", name: "EbiosRM", category: "Cybersecurity" },
  { src: "/logos/Elastic-Search.png", name: "ElasticSearch", category: "Cybersecurity" },
  { src: "/logos/elk-suite.png", name: "ELKSuite", category: "Cybersecurity" },
  { src: "/logos/Logstash.png", name: "Logstash", category: "Cybersecurity" },
  { src: "/logos/GitHub.png", name: "GitHub", category: "DevOps" },
  { src: "/logos/GitLab.png", name: "GitLab", category: "DevOps" },
  { src: "/logos/iso.png", name: "ISO", category: "Cybersecurity" },
  { src: "/logos/Java1.png", name: "Java", category: "Backend" },
  { src: "/logos/javascript.png", name: "Javascript", category: "Frontend" },
  { src: "/logos/Kibana.png", name: "Kibana", category: "DevOps" },
  { src: "/logos/Laravel.png", name: "Laravel", category: "Backend" },
  { src: "/logos/Linux.png", name: "Linux", category: "DevOps" },
  { src: "/logos/metasploit.png", name: "Metasploit", category: "Cybersecurity" },
  { src: "/logos/mysql.png", name: "Mysql", category: "Backend" },
  { src: "/logos/nmap.jpg", name: "Nmap", category: "Cybersecurity" },
  { src: "/logos/PHP1.png", name: "PHP", category: "Backend" },
  { src: "/logos/PostgresSQL.png", name: "Postgresql", category: "Backend" },
  { src: "/logos/Postman.png", name: "Postman", category: "Backend" },
  { src: "/logos/Powershell.png", name: "Powershell", category: "DevOps" },
  { src: "/logos/proxmox.png", name: "Proxmox", category: "DevOps" },
  { src: "/logos/Python.png", name: "Python", category: "Backend" },
  { src: "/logos/Spring.png", name: "Spring", category: "Backend" },
  { src: "/logos/sqlserver.jpg", name: "SqlServer", category: "Backend" },
  { src: "/logos/symfony.png", name: "Symfony", category: "Backend" },
  { src: "/logos/Traefik-Proxy.png", name: "Traefik", category: "DevOps" },
  { src: "/logos/windows.png", name: "Windows", category: "DevOps" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#e8ff00",
  Backend: "#00ff88",
  DevOps:  "#4d9fff",
  Cybersecurity:  "#bf5fff",
};

const CATEGORY_HUBS: Record<string, { x: number; y: number }> = {
  Frontend: { x: 0.28, y: 0.30 },
  Backend:  { x: 0.72, y: 0.30 },
  DevOps:   { x: 0.28, y: 0.70 },
  Cybersecurity:   { x: 0.72, y: 0.70 },
};

interface Node {
  id: number;
  logo: Logo;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  isHub: boolean;
}

function buildNodes(W: number, H: number): Node[] {
  const nodes: Node[] = [];

  // Hub nodes (category centers)
  Object.entries(CATEGORY_HUBS).forEach(([cat, pos], i) => {
    nodes.push({
      id: i,
      logo: { src: "", name: cat, category: cat as Logo["category"] },
      x: pos.x * W,
      y: pos.y * H,
      vx: 0, vy: 0,
      baseX: pos.x * W,
      baseY: pos.y * H,
      isHub: true,
    });
  });

  // Logo nodes — spread around their hub
  logos.forEach((logo, i) => {
    const hub = CATEGORY_HUBS[logo.category];
    const angle = (i / logos.filter(l => l.category === logo.category).length) * Math.PI * 2 + Math.random();
    const radius = 90 + Math.random() * 60;
    const bx = hub.x * W + Math.cos(angle) * radius;
    const by = hub.y * H + Math.sin(angle) * radius;
    nodes.push({
      id: Object.keys(CATEGORY_HUBS).length + i,
      logo,
      x: bx,
      y: by,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: bx,
      baseY: by,
      isHub: false,
    });
  });

  return nodes;
}


export default function Technologies() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
//   const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const hoveredNodeRef = useRef<Node | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Preload images
  useEffect(() => {
    logos.forEach(logo => {
      const img = new window.Image();
      img.src = logo.src;
      imagesRef.current[logo.src] = img;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        nodesRef.current = buildNodes(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const getHubIndex = (cat: string) =>
      Object.keys(CATEGORY_HUBS).indexOf(cat);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Animate logo nodes
      nodes.forEach(node => {
        if (node.isHub) return;
        // gentle drift back to base
        node.vx += (node.baseX - node.x) * 0.008;
        node.vy += (node.baseY - node.y) * 0.008;
        // mouse repulsion
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          const force = (80 - dist) / 80;
          node.vx += (dx / dist) * force * 1.2;
          node.vy += (dy / dist) * force * 1.2;
        }
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw edges: hub → logos
      nodes.forEach(node => {
        if (node.isHub) return;
        const hubIdx = getHubIndex(node.logo.category);
        const hub = nodes[hubIdx];
        const color = CATEGORY_COLORS[node.logo.category];
        const isActive = !activeCategory || activeCategory === node.logo.category;
        const alpha = isActive ? 0.35 : 0.05;

        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // // Draw hub-to-hub faint lines
      // const hubNodes = nodes.filter(n => n.isHub);
      // hubNodes.forEach((a, i) => {
      //   hubNodes.forEach((b, j) => {
      //     if (j <= i) return;
      //     ctx.beginPath();
      //     ctx.moveTo(a.x, a.y);
      //     ctx.lineTo(b.x, b.y);
      //     ctx.strokeStyle = "rgba(255,255,255,0.03)";
      //     ctx.lineWidth = 1;
      //     ctx.stroke();
      //   });
      // });

      // Draw hub nodes
      nodes.filter(n => n.isHub).forEach(hub => {
        const color = CATEGORY_COLORS[hub.logo.category];
        const isActive = !activeCategory || activeCategory === hub.logo.category;
        const alpha = isActive ? 1 : 0.2;

        // glow
        const grad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 40);
        grad.addColorStop(0, color + "30");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // ring
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 18, 0, Math.PI * 2);
        ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = `rgba(8,8,8,${alpha})`;
        ctx.fill();

        // label
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.font = "10px";
        ctx.letterSpacing = "3px";
        ctx.textAlign = "center";
        ctx.fillText(hub.logo.name.toUpperCase(), hub.x, hub.y + 36);
      });

      // Draw logo nodes
      nodes.filter(n => !n.isHub).forEach(node => {
        const color = CATEGORY_COLORS[node.logo.category];
        const isActive = !activeCategory || activeCategory === node.logo.category;
        // const isHovered = hoveredNode?.id === node.id;
        const isHovered = hoveredNodeRef.current?.id === node.id;
        const alpha = isActive ? 1 : 0.15;
        const r = isHovered ? 28 : 22;

        // glow on hover
        if (isHovered) {
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 50);
          grad.addColorStop(0, color + "40");
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(node.x, node.y, 50, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // circle bg
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${isActive ? 0.05 : 0.02})`;
        ctx.fill();
        ctx.strokeStyle = isHovered ? color : color + Math.round(alpha * 80).toString(16).padStart(2, "0");
        ctx.lineWidth = isHovered ? 1.5 : 1;
        ctx.stroke();

        // logo image
        const img = imagesRef.current[node.logo.src];
        if (img && img.complete) {
          ctx.globalAlpha = alpha;
          const s = r * 1.1;
          ctx.drawImage(img, node.x - s / 2, node.y - s / 2, s, s);
          ctx.globalAlpha = 1;
        }

        // name tooltip on hover
        if (isHovered) {
          ctx.fillStyle = "#fff";
          ctx.font = "bold 12px";
          ctx.letterSpacing = "2px";
          ctx.textAlign = "center";
          ctx.fillText(node.logo.name, node.x, node.y - r - 10);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };

      // Hover detection
      const found = nodesRef.current.find(n => {
        if (n.isHub) return false;
        const dx = n.x - mx;
        const dy = n.y - my;
        return Math.sqrt(dx * dx + dy * dy) < 36;
      });
    //   setHoveredNode(found ?? null);
      hoveredNodeRef.current = found ?? null;
      setHoveredName(found?.logo.name ?? null);
      canvas.style.cursor = found ? "pointer" : "default";
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
//   }, [hoveredNode, activeCategory]);
  }, [ activeCategory]);

  return (
    <section ref={containerRef} style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      background: "#0a0a0a",
      overflow: "hidden",
      display: "flex", 
      flexDirection: "column",
    }}>
    <div id="technologies" className="w-1/2 text-center m-auto capitol-font">
            <h1 className="text-2xl">
                Technologies
            </h1>
    </div>
      <style>{`
        .cat-btn {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 20px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .cat-btn:hover { opacity: 1 !important; }
      `}</style>

      {/* Title */}
      <div style={{
        position: "absolute",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        zIndex: 5,
        pointerEvents: "none",
        flexShrink: 0, 
      }}>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      {/* Category filters */}
      <div style={{
        position: "relative",
        // bottom: "40px",
        marginBottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "center",
        zIndex: 5,
        flexShrink: 0, 
      }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <button
            key={cat}
            className="cat-btn"
            onClick={() => setActiveCategory(prev => prev === cat ? null : cat)}
            style={{
              color: activeCategory === cat ? "#000" : color,
              borderColor: color,
              background: activeCategory === cat ? color : "transparent",
              opacity: activeCategory && activeCategory !== cat ? 0.4 : 1,
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  )
}