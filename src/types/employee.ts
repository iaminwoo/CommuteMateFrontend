export interface Employee {
  id: number;
  name: string;
  default_position: string;
}

export interface EmployeeName {
  id: number;
  name: string;
}

export interface EmployeeSchedule {
  date: string;
  total: number;
  employee_part: Part[];
  partner: string;
  next_dayoff: string;
}

export interface Part {
  part_name: string;
  employees: string[];
}

export interface EmployeeOrder {
  order: number;
  name: string;
};