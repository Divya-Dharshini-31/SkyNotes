import { useNavigate } from "react-router-dom";

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?`
    );

    if (!confirmed) {
      return;
    }

    await onDelete(note.id);
  };

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <article className="note-card">
      <div className="note-card-content">
        <div className="note-card-header">
          <h3>{note.title}</h3>

          <span className="note-date">
            {formatDate(note.updatedAt || note.createdAt)}
          </span>
        </div>

        <p className="note-preview">
          {note.content}
        </p>
      </div>

      <div className="note-card-actions">
        <button
          className="note-action view-action"
          onClick={() => navigate(`/notes/${note.id}`)}
        >
          View
        </button>

        <button
          className="note-action edit-action"
          onClick={() => navigate(`/notes/${note.id}/edit`)}
        >
          Edit
        </button>

        <button
          className="note-action delete-action"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default NoteCard;