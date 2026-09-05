import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ anchored = false }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Smooth-scroll helper — works whether anchored prop is set or not
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar sp-navbar">
      <div className="navbar-logo">
        <Link to="/">
          <div className="logo-symbol">AB</div>
          <div className="logo-text">
            <span className="logo-first-name">Amantle</span>
            <span className="logo-last-name">Bogacu</span>
          </div>
        </Link>
      </div>

      <ul className="navbar-links">
        {isHome ? (
          /* ── On the home page: smooth-scroll to sections ── */
          <>
            <li><button className="nav-anchor" onClick={() => scrollTo('home')}>Home</button></li>
            <li><button className="nav-anchor" onClick={() => scrollTo('about')}>About</button></li>
            <li><button className="nav-anchor" onClick={() => scrollTo('graph')}>MyGraph</button></li>
            <li><Link to="/cv" className={location.pathname === '/cv' ? 'active' : ''}>CV</Link></li>
          </>
        ) : (
          /* ── On other pages: regular links ── */
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#about">About</Link></li>
            <li><Link to="/#graph">MyGraph</Link></li>
            <li><Link to="/cv" className={location.pathname === '/cv' ? 'active' : ''}>CV</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
