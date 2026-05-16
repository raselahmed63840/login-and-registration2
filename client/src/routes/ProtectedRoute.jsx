import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token"); // login এ save করা token

  // যদি token না থাকে → login এ redirect করবে
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // যদি token থাকে → child route render করবে
  return <Outlet />;
}

export default ProtectedRoute;
