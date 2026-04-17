export type Risk = "High Risk" | "At Risk" | "On Watch" | "Low Risk";

export type ReadinessStatus =
  | "on_track"
  | "attendance_risk"
  | "growth_concern"
  | "el_progress_watch"
  | "off_track_credits"
  | "college_career_watch";

export type StudentRow = {
  id: string;
  name: string;
  grade: number;
  homeroom: string;

  risk: Risk;
  readinessStatus: ReadinessStatus;
  counselorNote: string;

  attendance: number; // percent
  daysAbsent: number;

  newaMath: number;
  newaReading: number;
  growthPercentile: number | null;

  wida: number | null;
  widaGoalMet: boolean | null;
  elFlag: boolean;

  iLearn: { ela: number; math: number };

  creditsEarned: number | null;
  creditsExpected: number | null;
  graduationPlanComplete: boolean | null;
  ninthGradeOnTrack: boolean | null;
  highSchoolCredits: number | null;
};

export const DEMO_STUDENTS: StudentRow[] = [
  {
    id: "abigail-mitchell",
    name: "Abigail Mitchell",
    grade: 3,
    homeroom: "A",
    risk: "On Watch",
    readinessStatus: "attendance_risk",
    counselorNote: "Needs steady attendance and extra literacy support to stay on track in the K-3 foundational years.",
    attendance: 88.0,
    daysAbsent: 14,
    newaMath: 190,
    newaReading: 180,
    growthPercentile: 44,
    wida: null,
    widaGoalMet: null,
    elFlag: false,
    iLearn: { ela: 390, math: 385 },
    creditsEarned: null,
    creditsExpected: null,
    graduationPlanComplete: null,
    ninthGradeOnTrack: null,
    highSchoolCredits: null,
  },
  {
    id: "mia-davis",
    name: "Mia Davis",
    grade: 6,
    homeroom: "D",
    risk: "On Watch",
    readinessStatus: "el_progress_watch",
    counselorNote: "Language growth is improving, but WIDA goal is not yet met. Core academics remain steady.",
    attendance: 95.1,
    daysAbsent: 8,
    newaMath: 207,
    newaReading: 202,
    growthPercentile: 52,
    wida: 4.2,
    widaGoalMet: false,
    elFlag: true,
    iLearn: { ela: 202, math: 207 },
    creditsEarned: null,
    creditsExpected: null,
    graduationPlanComplete: null,
    ninthGradeOnTrack: null,
    highSchoolCredits: null,
  },
  {
    id: "jordan-parker",
    name: "Jordan Parker",
    grade: 7,
    homeroom: "B",
    risk: "Low Risk",
    readinessStatus: "on_track",
    counselorNote: "Strong attendance, positive growth, and grade 7 planning milestones are on track.",
    attendance: 96.4,
    daysAbsent: 6,
    newaMath: 218,
    newaReading: 211,
    growthPercentile: 68,
    wida: null,
    widaGoalMet: null,
    elFlag: false,
    iLearn: { ela: 211, math: 218 },
    creditsEarned: 1,
    creditsExpected: 1,
    graduationPlanComplete: true,
    ninthGradeOnTrack: null,
    highSchoolCredits: 1,
  },
  {
    id: "liam-brown",
    name: "Liam Brown",
    grade: 9,
    homeroom: "Freshman Advisory",
    risk: "At Risk",
    readinessStatus: "off_track_credits",
    counselorNote: "Behind expected credit pace and not yet on track for freshman milestones.",
    attendance: 91.3,
    daysAbsent: 12,
    newaMath: 214,
    newaReading: 208,
    growthPercentile: 49,
    wida: null,
    widaGoalMet: null,
    elFlag: false,
    iLearn: { ela: 208, math: 214 },
    creditsEarned: 8,
    creditsExpected: 10,
    graduationPlanComplete: false,
    ninthGradeOnTrack: false,
    highSchoolCredits: 8,
  },
  {
    id: "evelyn-phillips",
    name: "Evelyn Phillips",
    grade: 12,
    homeroom: "Senior Advisory",
    risk: "On Watch",
    readinessStatus: "college_career_watch",
    counselorNote: "On track to graduate, but still needs stronger college/career benchmark evidence and credential completion.",
    attendance: 92.4,
    daysAbsent: 11,
    newaMath: 272,
    newaReading: 264,
    growthPercentile: 58,
    wida: null,
    widaGoalMet: null,
    elFlag: false,
    iLearn: { ela: 470, math: 465 },
    creditsEarned: 42,
    creditsExpected: 44,
    graduationPlanComplete: true,
    ninthGradeOnTrack: true,
    highSchoolCredits: 42,
  },
];

export function getStudentByName(name: string): StudentRow {
  return DEMO_STUDENTS.find((s) => s.name === name) ?? DEMO_STUDENTS[0];
}

export function getDefaultStudent(): StudentRow {
  return DEMO_STUDENTS[0];
}

export function riskCounts(students: StudentRow[]) {
  const base: Record<Risk, number> = {
    "High Risk": 0,
    "At Risk": 0,
    "On Watch": 0,
    "Low Risk": 0,
  };
  for (const s of students) base[s.risk] += 1;
  return base;
}
