import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "student" | "counselor";

export default function DemoRoleSwitcher() {
  const nav = useNavigate();
  const [role, setRole] = useState<Role>(
    () => (localStorage.getItem("demo-role") as Role) || "student"
  );

  useEffect(() => {
    localStorage.setItem("demo-role", role);
  }, [role]);

  return (
    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-slate-200">
      <span className="text-slate-500">Demo:</span>

      <select
        value={role}
        onChange={(e) => {
          const r = e.target.value as Role;
          setRole(r);
          nav("/" + r);
        }}
        className="bg-transparent font-semibold outline-none"
      >
        <option value="student">Student</option>
        <option value="counselor">Counselor</option>
      </select>
    </div>
  );
}
