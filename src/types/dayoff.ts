export interface Dayoff {
  employee_id: number;
  employee_order: number;
  name: string;
  date: string;
  order: number;
}

export interface DayoffEmployeeMonth {
  employee_id: number;
  year: number;
  month: number;
  dates: string[];
}