"use client";

import { useState, useRef } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  // const handleSubmit = async () => {
  //   if (!form.name || !form.email || !form.message) return;
  //   setStatus("sending");
  //   // Simule un envoi — remplace par ton vrai appel API
  //   await new Promise(res => setTimeout(res, 1800));
  //   setStatus("sent");
  // };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid",
    color: "#fff",
    fontFamily: "'Courier New', monospace",
    fontSize: "15px",
    padding: "14px 0",
    outline: "none",
    letterSpacing: "1px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  };

  const getInputColor = (field: string) =>
    focused === field ? "#e8ff00" : "#2a2a2a";
    
  return (
    // <section id="contact" className="mt-20">
    //     <div className="w-1/2 text-justify m-auto capitol-font">
    //         <h1 className="text-2xl">
    //             Contact
    //         </h1>
    //     </div>
    // </section>
    <section id="contact" style={{
      width: "100%",
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
      boxSizing: "border-box",
      fontFamily: "'Courier New', monospace",
    }}>
      <style>{`
        ::placeholder { color: #333; font-family: 'Courier New', monospace; letter-spacing: 2px; font-size: 11px; }
        textarea { resize: none; }

        .submit-btn {
          position: relative;
          overflow: hidden;
          background: transparent;
          border: 1px solid #e8ff00;
          color: #e8ff00;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 5px;
          text-transform: uppercase;
          padding: 18px 48px;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #e8ff00;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .submit-btn:hover::before { transform: translateX(0); }
        .submit-btn:hover { color: #000; }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .submit-btn span { position: relative; z-index: 1; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor { animation: blink 1s step-end infinite; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .field-wrap { animation: slideUp 0.5s ease both; }
      `}</style>

        <div className="m-auto capitol-font">
            <h1 className="text-2xl mb-10">
                Contact
            </h1>
        </div>
      {/* Form */}
      {status === "sent" ? (
        <div className="roboto-font" style={{
          textAlign: "center",
          animation: "slideUp 0.5s ease both",
        }}>
          <div style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "#00ff88",
            letterSpacing: "-2px",
            marginBottom: "16px"
          }}>
            Message sent.
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "grey" }}>
            I will give you an answer soon !
          </div>
        </div>
      ) : (
        <div ref={formRef} style={{ width: "100%", maxWidth: "600px" }}>

          {/* Name */}
          <div className="field-wrap" style={{ marginBottom: "40px", animationDelay: "0.05s" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              letterSpacing: "7px",
              color: focused === "name" ? "#e8ff00" : "white",
              textTransform: "uppercase",
              marginBottom: "4px",
              transition: "color 0.3s ease",
            }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="John Doe"
              onChange={handleChange}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              style={{ ...inputBase, borderBottomColor: getInputColor("name") }}
            />
          </div>

          {/* Email */}
          <div className="field-wrap" style={{ marginBottom: "40px", animationDelay: "0.1s" }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              letterSpacing: "7px",
              color: focused === "email" ? "#e8ff00" : "white",
              textTransform: "uppercase",
              marginBottom: "4px",
              transition: "color 0.3s ease",
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="jean@exemple.com"
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={{ ...inputBase, borderBottomColor: getInputColor("email") }}
            />
          </div>

          {/* Message */}
          <div className="field-wrap" style={{ marginBottom: "56px", animationDelay: "0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4px" }}>
              <label style={{
                fontSize: "14px",
                letterSpacing: "7px",
                color: focused === "message" ? "#e8ff00" : "white",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}>
                Message
              </label>
              <span style={{ fontSize: "9px", letterSpacing: "2px", color: "#2a2a2a" }}>
                {charCount}
              </span>
            </div>
            <textarea
              name="message"
              value={form.message}
              placeholder="Describe your project..."
              rows={5}
              onChange={handleChange}
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
              style={{ ...inputBase, borderBottomColor: getInputColor("message"), display: "block" }}
            />
          </div>

          {/* Submit */}
          <div className="field-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", animationDelay: "0.2s" }}>

            {/* Status text */}
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#333" }}>
              {status === "sending" && (
                <span>Envoi en cours<span className="cursor">_</span></span>
              )}
              {status === "error" && (
                <span style={{ color: "#ff4d4d" }}>Erreur — réessayez</span>
              )}
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={status === "sending" || !form.name || !form.email || !form.message}
            >
              <span>
                {status === "sending" ? "Envoi..." : "Send →"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div style={{
            marginTop: "72px",
            paddingTop: "40px",
            borderTop: "1px solid #161616",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "white" }}>
              Feel free to contact me
            </div>
            <a href="mailto:grelet.axel.85@gmail.com" style={{
              fontSize: "12px",
              letterSpacing: "2px",
              color: "white",
              textDecoration: "none",
              borderBottom: "1px solid grey",
              paddingBottom: "2px",
              transition: "color 0.2s, border-color 0.2s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#e8ff00";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e8ff00";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "white";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "grey";
              }}
            >
              grelet.axel.85@gmail.com
            </a>
          </div>
        </div>
      )}
    </section>
  )
}