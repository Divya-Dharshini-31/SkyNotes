import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/notes");

      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError("Unable to load your notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return notes;
    }

    return notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      return (
        title.includes(search) ||
        content.includes(search)
      );
    });
  }, [notes, searchTerm]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/notes/${id}`);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );
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
      return "";
    }

    const noteDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - noteDate.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    if (difference < oneDay && noteDate.getDate() === now.getDate()) {
      return noteDate.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    return noteDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPreview = (content) => {
    if (!content) {
      return "No content";
    }

    return content.replace(/\s+/g, " ").trim();
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="dashboard-container">

        <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              YOUR WORKSPACE
            </p>

            <h1>Your Notes</h1>

            <p className="dashboard-subtitle">
              Keep your ideas organized and accessible.
            </p>
          </div>

          <button
            className="primary-button dashboard-new-button"
            onClick={() => navigate("/notes/new")}
          >
            <span>+</span>
            New Note
          </button>
        </section>

        <section className="dashboard-toolbar">

          <div className="search-box">
            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {!loading && (
            <span className="note-count">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1
                ? "note"
                : "notes"}
            </span>
          )}

        </section>

        {loading && (
          <div className="state-container">
            <div className="loading-spinner"></div>
            <p>Loading your notes...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-container error-state">
            <div className="state-icon">!</div>

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              className="secondary-button"
              onClick={fetchNotes}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          notes.length === 0 && (
            <div className="empty-notes">

              <div className="empty-cloud">
                ☁
              </div>

              <h2>No notes yet</h2>

              <p>
                Your workspace is empty. Create your
                first note and start capturing your ideas.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/notes/new")
                }
              >
                Create Your First Note
              </button>

            </div>
          )}

        {!loading &&
          !error &&
          notes.length > 0 &&
          filteredNotes.length === 0 && (
            <div className="empty-notes">

              <div className="empty-cloud">
                ⌕
              </div>

              <h2>No matching notes</h2>

              <p>
                We couldn't find any notes matching "
                {searchTerm}".
              </p>

              <button
                className="secondary-button"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>

            </div>
          )}

        {!loading &&
          !error &&
          filteredNotes.length > 0 && (
            <section className="notes-grid">

              {filteredNotes.map((note) => (
                <article
                  className="note-card"
                  key={note.id}
                >

                  <div className="note-card-content">

                    <div className="note-card-header">

                      <h3 title={note.title}>
                        {note.title}
                      </h3>

                      <span className="note-date">
                        {formatDate(note.updatedAt)}
                      </span>

                    </div>

                    <p className="note-preview">
                      {getPreview(note.content)}
                    </p>

                  </div>

                  <div className="note-card-actions">

                    <button
                      className="note-action view-action"
                      onClick={() =>
                        navigate(`/notes/${note.id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="note-action edit-action"
                      onClick={() =>
                        navigate(
                          `/notes/${note.id}/edit`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="note-action delete-action"
                      onClick={() =>
                        handleDelete(note.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </section>
          )}

      </main>
    </div>
  );
}

export default Dashboard;