export type Position = {
  date: string;
  position: string;
};

export type EmployeeMonthPositions = {
  employee_id: number;
  year: number;
  month: number;
  positions: Position[];
};

export type PositionsAllMonth = {
  employee_id: number;
  employee_order: number;
  name: string;
  positions: Position[];
};