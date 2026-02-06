export type Risk = "High Risk" | "At Risk" | "On Watch" | "Low Risk";

export type StudentRow = {
  id: string;
  name: string;
  grade: number;
  homeroom: string;
  newaMath: number;
  newaReading: number;
  attendance: number; // percent
  wida: number;
  iLearn: { ela: number; math: number };
  risk: Risk;
};

export const DEMO_STUDENTS: StudentRow[] = [
  {
    id: "stu_001",
    name: "Jordan Lee",
    grade: 7,
    homeroom: "B",
    newaMath: 215,
    newaReading: 208,
    attendance: 71,
    wida: 412,
    iLearn: { ela: 398, math: 398 },
    risk: "On Watch",
  },
  {
    id: "stu_002",
    name: "Avery Patel",
    grade: 7,
    homeroom: "A",
    newaMath: 246,
    newaReading: 231,
    attendance: 59,
    wida: 575,
    iLearn: { ela: 410, math: 410 },
    risk: "At Risk",
  },
  {
    id: "stu_003",
    name: "Mason Rodriguez",
    grade: 8,
    homeroom: "A",
    newaMath: 208,
    newaReading: 201,
    attendance: 69,
    wida: 555,
    iLearn: { ela: 392, math: 392 },
    risk: "At Risk",
  },
  {
    id: "stu_004",
    name: "Olivia Nguyen",
    grade: 8,
    homeroom: "A",
    newaMath: 211,
    newaReading: 193,
    attendance: 89,
    wida: 553,
    iLearn: { ela: 421, math: 421 },
    risk: "High Risk",
  },
  {
    id: "stu_005",
    name: "Xavier Brown",
    grade: 11,
    homeroom: "A",
    newaMath: 253,
    newaReading: 246,
    attendance: 89,
    wida: 537,
    iLearn: { ela: 446, math: 446 },
    risk: "Low Risk",
  },
  {
    id: "stu_006",
    name: "Emma Davis",
    grade: 11,
    homeroom: "A",
    newaMath: 263,
    newaReading: 255,
    attendance: 59,
    wida: 532,
    iLearn: { ela: 405, math: 405 },
    risk: "At Risk",
  },
  {
    id: "stu_007",
    name: "Lucas Chen",
    grade: 7,
    homeroom: "A",
    newaMath: 255,
    newaReading: 242,
    attendance: 59,
    wida: 531,
    iLearn: { ela: 401, math: 401 },
    risk: "At Risk",
  },
  {
    id: "stu_008",
    name: "Sophia Wilson",
    grade: 8,
    homeroom: "A",
    newaMath: 233,
    newaReading: 224,
    attendance: 89,
    wida: 532,
    iLearn: { ela: 432, math: 432 },
    risk: "High Risk",
  },
  {
    id: "stu_009",
    name: "Caleb Martinez",
    grade: 10,
    homeroom: "A",
    newaMath: 288,
    newaReading: 273,
    attendance: 69,
    wida: 528,
    iLearn: { ela: 439, math: 439 },
    risk: "At Risk",
  },
  {
    id: "stu_010",
    name: "Mia Hernandez",
    grade: 9,
    homeroom: "A",
    newaMath: 239,
    newaReading: 228,
    attendance: 89,
    wida: 527,
    iLearn: { ela: 418, math: 418 },
    risk: "Low Risk",
  },

  // --- EXTRA DEMO STUDENTS ---
  { id: "noah-thompson", name: "Noah Thompson", grade: 6, homeroom: "B", newaMath: 232, newaReading: 222, attendance: 93, wida: 520, iLearn: { ela: 432, math: 427 }, risk: "Low Risk" },
  { id: "liam-jackson", name: "Liam Jackson", grade: 6, homeroom: "C", newaMath: 210, newaReading: 200, attendance: 82, wida: 495, iLearn: { ela: 410, math: 405 }, risk: "On Watch" },
  { id: "isabella-moore", name: "Isabella Moore", grade: 5, homeroom: "A", newaMath: 198, newaReading: 188, attendance: 76, wida: 468, iLearn: { ela: 398, math: 393 }, risk: "At Risk" },
  { id: "sophia-martin", name: "Sophia Martin", grade: 4, homeroom: "B", newaMath: 205, newaReading: 195, attendance: 71, wida: 455, iLearn: { ela: 405, math: 400 }, risk: "High Risk" },
  { id: "ethan-wright", name: "Ethan Wright", grade: 9, homeroom: "D", newaMath: 254, newaReading: 244, attendance: 89, wida: 510, iLearn: { ela: 454, math: 449 }, risk: "Low Risk" },
  { id: "amelia-scott", name: "Amelia Scott", grade: 10, homeroom: "C", newaMath: 241, newaReading: 231, attendance: 83, wida: 498, iLearn: { ela: 441, math: 436 }, risk: "On Watch" },
  { id: "mia-adams", name: "Mia Adams", grade: 11, homeroom: "A", newaMath: 262, newaReading: 252, attendance: 78, wida: 505, iLearn: { ela: 462, math: 457 }, risk: "At Risk" },
  { id: "aiden-baker", name: "Aiden Baker", grade: 12, homeroom: "B", newaMath: 270, newaReading: 260, attendance: 92, wida: 522, iLearn: { ela: 470, math: 465 }, risk: "Low Risk" },
  { id: "harper-nelson", name: "Harper Nelson", grade: 7, homeroom: "C", newaMath: 226, newaReading: 216, attendance: 67, wida: 470, iLearn: { ela: 426, math: 421 }, risk: "High Risk" },
  { id: "elijah-carter", name: "Elijah Carter", grade: 8, homeroom: "D", newaMath: 219, newaReading: 209, attendance: 74, wida: 482, iLearn: { ela: 419, math: 414 }, risk: "At Risk" },
  { id: "abigail-mitchell", name: "Abigail Mitchell", grade: 3, homeroom: "A", newaMath: 190, newaReading: 180, attendance: 88, wida: 430, iLearn: { ela: 390, math: 385 }, risk: "On Watch" },
  { id: "james-perez", name: "James Perez", grade: 3, homeroom: "B", newaMath: 184, newaReading: 174, attendance: 66, wida: 415, iLearn: { ela: 384, math: 379 }, risk: "High Risk" },
  { id: "charlotte-roberts", name: "Charlotte Roberts", grade: 5, homeroom: "C", newaMath: 214, newaReading: 204, attendance: 91, wida: 460, iLearn: { ela: 414, math: 409 }, risk: "Low Risk" },
  { id: "benjamin-turner", name: "Benjamin Turner", grade: 9, homeroom: "A", newaMath: 238, newaReading: 228, attendance: 79, wida: 490, iLearn: { ela: 438, math: 433 }, risk: "At Risk" },
  { id: "evelyn-phillips", name: "Evelyn Phillips", grade: 12, homeroom: "D", newaMath: 275, newaReading: 265, attendance: 84, wida: 515, iLearn: { ela: 475, math: 470 }, risk: "On Watch" },

];

export function getStudentByName(name: string): StudentRow {
  return DEMO_STUDENTS.find((s) => s.name === name) ?? DEMO_STUDENTS[0];
}

export function getDefaultStudent(): StudentRow {
  return DEMO_STUDENTS[0];
}

export function riskCounts(students: StudentRow[]) {
  const base: Record<Risk, number> = { "High Risk": 0, "At Risk": 0, "On Watch": 0, "Low Risk": 0 };
  for (const s of students) base[s.risk] += 1;
  return base;
}
