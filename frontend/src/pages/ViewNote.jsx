import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ViewNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/api/notes/${id}`);

        setNote(response.data);
      } catch (error) {
        console.error("Failed to fetch note:", error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (error.response?.status === 404) {
          setError("This note could not be found.");
        } else {
          setError("Unable to load the note. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/notes/${id}`);

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete note:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      alert("Unable to delete the note. Please try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="app-page">
        <Navbar />

        <main className="state-container page-state">
          <div className="loading-spinner"></div>
          <p>Loading note...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-page">
        <Navbar />

        <main className="state-container page-state error-state">
          <div className="state-icon">!</div>

          <h2>Note unavailable</h2>

          <p>{error}</p>

          <button
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to Notes
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="app-page">
      <Navbar />

      <main className="view-note-container">
        <div className="view-note-topbar">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Notes
          </button>

          <div className="view-note-actions">
            <button
              className="secondary-button"
              onClick={() => navigate(`/notes/${id}/edit`)}
            >
              Edit
            </button>

            <button
              className="danger-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        <article className="note-detail-card">
          <div className="note-detail-header">
            <p className="dashboard-eyebrow">NOTE</p>

            <h1>{note.title}</h1>

            <div className="note-metadata">
              <span>
                Created {formatDate(note.createdAt)}
              </span>

              <span className="metadata-separator">•</span>

              <span>
                Updated {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>

          <div className="note-detail-content">
            {note.content}
          </div>

          {note.versions && note.versions.length > 0 && (
            <div className="version-info">
              <span className="version-icon">↻</span>

              <span>
                {note.versions.length} previous{" "}
                {note.versions.length === 1 ? "version" : "versions"} saved
              </span>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}

export default ViewNote;