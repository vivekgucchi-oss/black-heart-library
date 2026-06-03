// =============================================
// FILE: src/pages/AdminPage.tsx
// Admin panel — sirf admin role wale dekh sakte hain
// =============================================

import { useEffect, useState } from "react";

type User = { id: number; name: string; email: string; role: string };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setUsers(data.users);
      })
      .catch(() => setError("Data load nahi hua"))
      .finally(() => setLoading(false));
  }, []);

  async function changeRole(userId: number, newRole: string) {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    if (data.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  }

  if (loading) return <div style={styles.page}><p style={{ color: "#aaa" }}>Loading...</p></div>;
  if (error) return <div style={styles.page}><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🛡️ Admin Panel</h1>
        <p style={styles.subtitle}>Total users: {users.length}</p>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Naam</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: user.role === "admin" ? "#e63946" : "#444",
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={styles.td}>
                  {user.role === "user" ? (
                    <button style={styles.btnAdmin} onClick={() => changeRole(user.id, "admin")}>
                      Admin Banao
                    </button>
                  ) : (
                    <button style={styles.btnUser} onClick={() => changeRole(user.id, "user")}>
                      User Banao
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0f0f0f", padding: "40px 20px", fontFamily: "sans-serif" },
  container: { maxWidth: "800px", margin: "0 auto" },
  title: { color: "#fff", fontSize: "24px", marginBottom: "8px" },
  subtitle: { color: "#888", marginBottom: "24px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { color: "#aaa", textAlign: "left", padding: "12px", borderBottom: "1px solid #333", fontSize: "13px" },
  tr: { borderBottom: "1px solid #222" },
  td: { color: "#ddd", padding: "12px", fontSize: "14px" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", color: "#fff" },
  btnAdmin: { padding: "5px 12px", background: "#e63946", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  btnUser: { padding: "5px 12px", background: "#555", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
};
