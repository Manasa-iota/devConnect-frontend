import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

type Props = { children: React.ReactElement };

export default function ProtectedRoute({ children }: Props) {
  const { user, ready } = useAuthStore();
  const loc = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}
