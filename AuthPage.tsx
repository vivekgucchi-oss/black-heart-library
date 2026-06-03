// =============================================
// FILE: src/pages/AuthPage.tsx
// Naya file banao — Login + Register page
// =============================================

import { useState } from "react";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body: any = { email, password };
    if (mode === "register") body.name = name;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kuch galat hua");
      } else {
        // Login ho gaya — page reload karo
        window.location.href = "/";
      }
    } catch (err) {
      setError("Network error, dobara try karo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📚 Black Heart Library</h1>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === "login" ? styles.activeTab : {}) }}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(mode === "register" ? styles.activeTab : {}) }}
            onClick={() => { setMode("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === "register" && (
            <div style={styles.field}>
              <label style={styles.label}>Naam</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Apna naam likho"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={styles.error}>⚠️ {error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Wait karo..." : mode === "login" ? "Login Karo" : "Account Banao"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f0f0f",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "22px",
  },
  tabs: {
    display: "flex",
    marginBottom: "24px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #333",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    color: "#888",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeTab: {
    background: "#e63946",
    color: "#fff",
    fontWeight: "bold",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { color: "#aaa", fontSize: "13px" },
  input: {
    padding: "10px 14px",
    background: "#111",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  error: { color: "#ff6b6b", fontSize: "13px", margin: 0 },
  button: {
    padding: "12px",
    background: "#e63946",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
