import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AuthContext";

type StudentRow = {
  student_id: string;
  first_name: string;
  last_name: string;
  grade: string;
  school_id: number;
  status: string | null;
};

export default function Students() {
  const { logout } = useAuth();
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/api/students/");
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErr(e?.message || "Failed to load students");
      }
    })();
  }, []);

  return (
    <div style={{ padding: 18, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Students</h2>
        <button onClick={logout}>Log out</button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["ID", "Name", "Grade", "School", "Status"].map((h) => (
              <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px 6px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.student_id}>
              <td style={{ padding: "8px 6px", borderBottom: "1px solid #f0f0f0" }}>{s.student_id}</td>
              <td style={{ padding: "8px 6px", borderBottom: "1px solid #f0f0f0" }}>{s.last_name}, {s.first_name}</td>
              <td style={{ padding: "8px 6px", borderBottom: "1px solid #f0f0f0" }}>{s.grade}</td>
              <td style={{ padding: "8px 6px", borderBottom: "1px solid #f0f0f0" }}>{s.school_id}</td>
              <td style={{ padding: "8px 6px", borderBottom: "1px solid #f0f0f0" }}>{s.status ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
