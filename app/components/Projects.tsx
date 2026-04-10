"use client";

import { useState, useEffect } from "react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  accent: string;
}

const slides: Slide[] = [
  { id: 1, title: "I have hands-on experience building and integrating secure REST APIs using PHP (Symfony, API Platform). I developed APIs for both front-office and back-office applications, ensuring scalability, maintainability, and compliance with security best practices.", subtitle: "API Development", color: "#0f0f0f", accent: "#e8ff00" },
  { id: 2, title: "I worked with multiple relational database systems such as MySQL, PostgreSQL, MariaDB, and SQL Server. My experience includes designing schemas, optimizing queries, and managing secure database environments for enterprise applications.", subtitle: "Databases", color: "#1a0a2e", accent: "#bf5fff" },
  { id: 3, title: "With strong DevOps skills, I deployed and managed containerized applications using Docker and Proxmox clusters. I also automated backup processes and implemented CI/CD pipelines with GitLab, ensuring reliable and secure deployments.", subtitle: "Infrastructure", color: "#0a1a0f", accent: "#00ff88" },
  { id: 4, title: "I have developed full-stack web applications using frameworks such as Symfony, Laravel, Angular, and JavaScript/TypeScript. My work included the redesign of secure web applications, implementing responsive UIs, and optimizing user experience.", subtitle: "Web Development", color: "#1a0a0a", accent: "#ff4d4d" },
  { id: 5, title: "I conducted internal web penetration tests, application security audits, and risk analyses based on the EBIOS RM method (aligned with ISO 27005). I also gained expertise during my formation in forensic analysis ,security monitoring and SOC analyse with tools like Elastic Stack, Wireshark, and Metasploit.", subtitle: "Cybersecurity", color: "#0a0f1a", accent: "#4d9fff" },
  { id: 6, title: "Beyond web, I explored broader software development using Java, Spring Boot, Kotlin, and Flutter. This versatility allows me to adapt to different ecosystems and deliver reliable applications, from mobile apps to enterprise solutions.", subtitle: "Software Development", color: "#000000", accent: "#D3D3D3" },
];

function getPosition(index: number, current: number, total: number) {
  let diff = index - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}
export default function Projects() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

  const go = (dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + dir + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const getCardStyle = (pos: number, slide: Slide): React.CSSProperties => {
    const absPos = Math.abs(pos);

    if (absPos > 2) return { display: "none" };

    const translateX = pos * 280;
    const translateZ = absPos === 0 ? 0 : absPos === 1 ? -120 : -220;
    const rotateY = pos * -18;
    const scale = absPos === 0 ? 1 : absPos === 1 ? 0.82 : 0.65;
    const opacity = absPos === 0 ? 1 : absPos === 1 ? 0.75 : 0.4;
    const zIndex = 10 - absPos;
    const blur = absPos === 0 ? 0 : absPos === 1 ? 1 : 3;

    return {
      position: "absolute",
      width: "320px",
      height: "420px",
      left: "50%",
      top: "50%",
      marginLeft: "-160px",
      marginTop: "-210px",
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
      transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      cursor: pos !== 0 ? "pointer" : "default",
      borderRadius: "20px",
      overflow: "hidden",
      background: slide.color,
      border: `1px solid ${pos === 0 ? slide.accent + "60" : "#ffffff10"}`,
      boxShadow: pos === 0
        ? `0 0 60px ${slide.accent}30, 0 30px 60px rgba(0,0,0,0.5)`
        : "0 20px 40px rgba(0,0,0,0.4)",
    };
  };
  return (
    <section id="projects" className="mt-20">
        <div className="w-1/2 text-center m-auto">
            <h1 className="md:text-2xl capitol-font">
                PROJECTS
            </h1>
            {/* carousel */}
        </div>
        <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      // background: "#080808",
      background: "#0a0a0a",
      // fontFamily: "'Courier New', monospace",
      userSelect: "none",
      overflow: "hidden",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        zIndex: 100,
        opacity: 0.4,
      }} />

      {/* Label */}
      <div className="roboto-font" style={{
        position: "absolute",
        top: "48px",
        fontSize: "11px",
        letterSpacing: "6px",
        color: "#444",
        textTransform: "uppercase",
      }}>
        {/* Portfolio — {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")} */}
      </div>

      {/* Carousel scene */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "500px",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}>
        <div style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}>
          {slides.map((slide, i) => {
            const pos = getPosition(i, current, slides.length);
            return (
              <div
                className="roboto-font"
                key={slide.id}
                style={getCardStyle(pos, slide)}
                onClick={() => {
                  if (pos === 1) go(1);
                  if (pos === -1) go(-1);
                }}
              >
                {/* Card inner */}
                <div style={{ padding: "40px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  {/* Top accent line */}
                  <div style={{
                    width: "40px",
                    height: "2px",
                    background: slide.accent,
                    transition: "width 0.4s ease",
                  }} />

                  {/* Content */}
                  <div>
                    <div style={{
                      fontSize: "20px",
                      letterSpacing: "4px",
                      color: slide.accent,
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}>
                      {slide.subtitle}
                    </div>
                    <div style={{
                      fontSize: "18px",
                      fontWeight: "900",
                      color: "#fff",
                      lineHeight: 1,
                      // letterSpacing: "-2px",
                    }}>
                      {slide.title}
                    </div>
                  </div>

                  {/* Bottom number
                  <div style={{
                    fontSize: "60px",
                    fontWeight: "900",
                    color: slide.accent + "15",
                    lineHeight: 1,
                    marginBottom: "-20px",
                  }}>
                    {String(slide.id).padStart(2, "0")}
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "60px",
        alignItems: "center",
      }}>
        <button onClick={() => go(-1)} style={{
          width: "52px", height: "52px",
          borderRadius: "50%",
          border: "1px solid #333",
          background: "transparent",
          color: "#fff",
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = slides[current].accent)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#333")}
        >
          ←
        </button>

        {/* Dots */}
        <div style={{ display: "flex", gap: "8px" }}>
          {slides.map((slide, i) => (
            <div key={i} onClick={() => {
              const diff = i - current;
              if (diff !== 0) setCurrent(i);
            }} style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? slides[current].accent : "#333",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }} />
          ))}
        </div>

        <button onClick={() => go(1)} style={{
          width: "52px", height: "52px",
          borderRadius: "50%",
          border: "1px solid #333",
          background: "transparent",
          color: "#fff",
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = slides[current].accent)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#333")}
        >
          →
        </button>
      </div>

      {/* Keyboard hint */}
      <div style={{
        position: "absolute",
        bottom: "40px",
        fontSize: "10px",
        letterSpacing: "3px",
        color: "#2a2a2a",
        textTransform: "uppercase",
      }}>
      </div>
    </div>
    </section>
    
  )
}