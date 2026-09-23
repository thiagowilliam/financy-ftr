import { Navigate, Route, Routes } from "react-router-dom";
import { ExamplePage } from "@/pages/Example";
import { StyleGuidePage } from "@/pages/StyleGuide";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { useAuthStore } from "./stores/auth";
import { TestePage } from "./pages/Teste";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <StyleGuidePage />
          </PublicRoute>
          } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>} />
        <Route path="/exemplo" element={
          <PublicRoute>
            <ExamplePage />
          </PublicRoute>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TestePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
