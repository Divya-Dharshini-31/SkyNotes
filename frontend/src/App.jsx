import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import ViewNote from "./pages/ViewNote";
import EditNote from "./pages/EditNote";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <ViewNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id/edit"
          element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;