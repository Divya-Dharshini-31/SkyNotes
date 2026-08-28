import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
      >
        <div className="brand-icon">☁</div>
        <span>SkyNotes</span>
      </div>

      <div className="navbar-actions">
        <button
          className="new-note-nav-button"
          onClick={() => navigate("/notes/new")}
        >
          <span>+</span>
          New Note
        </button>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;