import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav className="flex justify-between items-center align-middle mt-10">
          <div className="flex items-center ml-10 md:text-3xl sm:text-sm">
            <img 
              src="/logos/logo_axel.png" 
              alt="logo"
              className="w-8 h-8 md:w-30 md:h-30 object-contain"
            />
            <a className="pointless-font" href="/">AXEL GRELET</a>
          </div>
          <div className="md:hidden mr-10">
              <button id="menu-toggle" className="text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
              </button>
          </div>
          <div className="hidden md:flex gap-x-5 mr-20 text-xl">
            <a className="capitol-font" href="/">HOME</a>
            <a className="capitol-font" href="#projects">PROJECTS</a>
            <a className="capitol-font" href="#technologies">TECHNOLOGIES</a>
            <a className="capitol-font" href="#contact">CONTACT</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}