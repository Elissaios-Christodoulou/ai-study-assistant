import { useState, useRef, useEffect } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  // Κλείνει το menu όταν πατάμε έξω από το navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        !navbarRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Κλείνει το menu όταν πατάμε Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Κλείνει το menu όταν η οθόνη γίνει μεγαλύτερη από 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <h2>AI Study Assistant</h2>

      <button
        type="button"
        className="menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={
          isMenuOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      <div
        id="navigation-menu"
        className={`nav-links ${isMenuOpen ? "open" : ""}`}
      >
        <a href="#home" onClick={() => setIsMenuOpen(false)}>
          Home
        </a>

        <a href="#features" onClick={() => setIsMenuOpen(false)}>
          Features
        </a>

        <a href="#assistant" onClick={() => setIsMenuOpen(false)}>
          Assistant
        </a>
      </div>
    </nav>
  );
}

export default Navbar;