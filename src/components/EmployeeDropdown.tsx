"use client";

import { EmployeeName } from "@/types/employee";
import { useEffect, useState } from "react";

interface EmployeeDropdownProps {
  value: number | null;
  onChange: (id: number) => void;
}

export default function EmployeeDropdown({
  value,
  onChange,
}: EmployeeDropdownProps) {
  const [employees, setEmployees] = useState<EmployeeName[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE}/employees/names`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

        const data = await res.json();
        setEmployees(data.employees_names);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [API_BASE]);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border rounded p-2"
    >
      <option value="" disabled>
        직원 선택
      </option>
      {employees.map((emp) => (
        <option key={emp.id} value={emp.id}>
          {emp.name}
        </option>
      ))}
    </select>
  );
}
