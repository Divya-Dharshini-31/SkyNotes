import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/api/notes/${id}`);

        setTitle(response.data.title || "");
        setContent(response.data.content || "");
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

  const handleUpdateNote = async (e) => {
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

    setSaving(true);

    try {
      await api.put(`/api/notes/${id}`, {
        title: title.trim(),
        content: content.trim(),
      });

      navigate(`/notes/${id}`);
    } catch (error) {
      console.error("Failed to update note:", error);

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
        "Unable to update the note. Please try again.";

      setError(
        typeof message === "string"
          ? message
          : "Unable to update the note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/notes/${id}`);
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

  if (error && !title && !content) {
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

      <main className="editor-container">

        <div className="editor-header">
          <div>
            <p className="dashboard-eyebrow">EDIT NOTE</p>

            <h1>Edit Note</h1>

            <p className="editor-subtitle">
              Update your note. Your previous version will be preserved.
            </p>
          </div>
        </div>

        <form className="note-editor" onSubmit={handleUpdateNote}>

          <div className="editor-field">
            <label htmlFor="edit-note-title">
              Title
            </label>

            <input
              id="edit-note-title"
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              maxLength={150}
            />
          </div>

          <div className="editor-field">
            <div className="content-label-row">
              <label htmlFor="edit-note-content">
                Content
              </label>

              <span>{content.length} characters</span>
            </div>

            <textarea
              id="edit-note-content"
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={saving}
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
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}

export default EditNote;