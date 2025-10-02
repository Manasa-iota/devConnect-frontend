import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Feed from "./pages/Feed";
import Requests from "./pages/Requests";
import Connections from "./pages/Connections";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Signup from "./components/Signup";
import Messages from "./pages/Messages";

export default function App() {
  const refresh = useAuthStore((s) => s.refresh);
  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route
            path="messages/:peerId"
            element={<ProtectedRoute><Messages /></ProtectedRoute>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
