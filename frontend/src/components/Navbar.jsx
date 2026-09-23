import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      {/* Files in frontend/public are served from the website root. */}
      <Link className="brand" to="/dashboard">
        <img src="/logo.jpg" alt="Khat logo" />
        <span>Khat</span>
      </Link>

      <div className="nav-links">
        <Link to="/dashboard">Home</Link>
        <Link to="/history">History</Link>
      </div>

      <button onClick={onLogout}>
        <span>Sign out</span>
      </button>
    </nav>
  );
}

export default Navbar;
