import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav className="flex justify-between mt-10">
          <div className="ml-3">
            <a className="pointless-font text-xl" href="/">AXEL GRELET</a>
          </div>
          <div className="flex gap-x-5 mr-20">
            <a className="capitol-font" href="/">HOME</a>
            <a className="capitol-font" href="/projects">PROJECTS</a>
            <a className="capitol-font" href="/technologies">TECHNOLOGIES</a>
            <a className="capitol-font" href="/contact">CONTACT</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}