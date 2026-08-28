import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function CreateNote() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateNote = async (e) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some content.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/notes", {
        title: title.trim(),
        content: content.trim(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create note:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      const message =
        error.response?.data?.message ||
        "Unable to create the note. Please try again.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to create the note. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="editor-container">
        <div className="editor-header">
          <div>
            <p className="dashboard-eyebrow">NEW NOTE</p>

            <h1>Create a Note</h1>

            <p className="editor-subtitle">
              Capture an idea, thought, or anything worth remembering.
            </p>
          </div>
        </div>

        <form className="note-editor" onSubmit={handleCreateNote}>
          <div className="editor-field">
            <label htmlFor="note-title">Title</label>

            <input
              id="note-title"
              type="text"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              maxLength={150}
              autoFocus
            />
          </div>

          <div className="editor-field">
            <div className="content-label-row">
              <label htmlFor="note-content">Content</label>

              <span>{content.length} characters</span>
            </div>

            <textarea
              id="note-content"
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="form-message error-message">
              {error}
            </div>
          )}

          <div className="editor-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateNote;