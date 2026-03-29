import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginResponse = {
  token: string;
  user: { id: number; name: string; email: string; role: string | null };
};

const Login = () => {
  const navigate = useNavigate();
  const isDev = useMemo(() => import.meta.env.MODE === "development", []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const doLogin = async (path: string, body?: unknown) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        setError("Login gagal");
        return;
      }

      const data = (await res.json()) as LoginResponse;
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      navigate("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-sunken p-4">
      <div className="w-full max-w-md glass-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Login Admin</h1>
        <p className="text-sm text-muted-foreground mb-6">Masuk untuk mengelola konten.</p>

        {error && <div className="mb-4 text-sm text-destructive">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            disabled={isLoading}
            onClick={() => doLogin("/api/auth/login", { email, password })}
            className="w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Login
          </button>

          {isDev && (
            <button
              disabled={isLoading}
              onClick={() => {
                setError(null);
                setEmail("admin@local.dev");
                setPassword("admin123");
              }}
              className="w-full px-6 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50"
            >
              Isi Otomatis (Dev)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
