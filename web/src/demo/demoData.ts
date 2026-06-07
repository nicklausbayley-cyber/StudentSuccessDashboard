export type Risk = "High Risk" | "At Risk" | "On Watch" | "Low Risk";

export type ReadinessStatus =
  | "on_track"
  | "attendance_risk"
  | "growth_concern"
  | "el_progress_watch"
  | "off_track_credits"
  | "college_career_watch";

export type WeeklyGoalStatus = "not_started" | "in_progress" | "complete";

export type InterventionStatus = "none" | "planned" | "in_progress" | "completed";

export type PortfolioPreview = {
  goals: string[];
  workSamples: string[];
  credentials: string[];
  reflections: string[];
  futurePlans: string[];
};

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
  creditsNeeded: number | null;
  graduationPlanComplete: boolean | null;
  ninthGradeOnTrack: boolean | null;
  highSchoolCredits: number | null;

  teacherWeeklyGoal: string;
  studentWeeklyGoal: string;
  weeklyGoalStatus: WeeklyGoalStatus;
  starsEarnedThisWeek: number;
  attendanceStreak: number;
  encouragementMessage: string;
  rewardBadge: string | null;

  flagReasons: string[];
  interventionStatus: InterventionStatus;
  interventionOwner: string | null;
  parentOutreachNeeded: boolean;
  parentContacted: boolean;
  followUpDueDate: string | null;
  contactNotes: string | null;

  graduationMilestones: string[];
  nextReadinessStep: string | null;
  portfolioPreview: PortfolioPreview | null;
};

export const DEMO_STUDENTS: StudentRow[] = [
  {
    id: "abigail-mitchell",
    name: "Abigail Mitchell",
    grade: 3,
    homeroom: "A",

    risk: "On Watch",
    readinessStatus: "attendance_risk",
    counselorNote: "Attendance and literacy support needed.",

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
    creditsNeeded: null,
    graduationPlanComplete: null,
    ninthGradeOnTrack: null,
    highSchoolCredits: null,

    teacherWeeklyGoal: "Read 15 minutes each night.",
    studentWeeklyGoal: "Be at school every day this week.",
    weeklyGoalStatus: "in_progress",
    starsEarnedThisWeek: 3,
    attendanceStreak: 2,
    encouragementMessage: "You are building strong habits. Keep showing up and reading each day!",
    rewardBadge: "Reading Starter",

    flagReasons: [
      "Attendance below K–3 target",
      "Reading support recommended",
    ],
    interventionStatus: "planned",
    interventionOwner: "Ms. Carter",
    parentOutreachNeeded: true,
    parentContacted: false,
    followUpDueDate: "2026-04-24",
    contactNotes: "Contact family about attendance pattern and reading practice support.",

    graduationMilestones: [],
    nextReadinessStep: "Improve attendance consistency and complete weekly reading goal.",
    portfolioPreview: null,
  },
  {
    id: "mia-davis",
    name: "Mia Davis",
    grade: 6,
    homeroom: "D",

    risk: "On Watch",
    readinessStatus: "el_progress_watch",
    counselorNote: "WIDA goal not yet met; core academics steady.",

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
    creditsNeeded: null,
    graduationPlanComplete: null,
    ninthGradeOnTrack: null,
    highSchoolCredits: null,

    teacherWeeklyGoal: "Practice academic vocabulary in reading and science.",
    studentWeeklyGoal: "Complete EL vocabulary practice three times this week.",
    weeklyGoalStatus: "in_progress",
    starsEarnedThisWeek: 4,
    attendanceStreak: 5,
    encouragementMessage: "Your attendance is strong. Keep building language growth one goal at a time.",
    rewardBadge: "Vocabulary Builder",

    flagReasons: [
      "WIDA goal not yet met",
      "Continue monitoring English-language progress",
    ],
    interventionStatus: "in_progress",
    interventionOwner: "Mr. Nguyen",
    parentOutreachNeeded: false,
    parentContacted: true,
    followUpDueDate: "2026-04-30",
    contactNotes: "Family updated on EL growth plan and classroom vocabulary supports.",

    graduationMilestones: [],
    nextReadinessStep: "Continue EL support plan and monitor WIDA progress toward goal.",
    portfolioPreview: null,
  },
  {
    id: "jordan-parker",
    name: "Jordan Parker",
    grade: 7,
    homeroom: "B",

    risk: "Low Risk",
    readinessStatus: "on_track",
    counselorNote: "On track across attendance, growth, and planning milestones.",

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
    creditsNeeded: 0,
    graduationPlanComplete: true,
    ninthGradeOnTrack: null,
    highSchoolCredits: 1,

    teacherWeeklyGoal: "Maintain strong attendance and complete planning reflection.",
    studentWeeklyGoal: "Finish my weekly planning check-in.",
    weeklyGoalStatus: "complete",
    starsEarnedThisWeek: 5,
    attendanceStreak: 9,
    encouragementMessage: "Great work staying on track. Your consistency is paying off.",
    rewardBadge: "On-Track Leader",

    flagReasons: [],
    interventionStatus: "none",
    interventionOwner: null,
    parentOutreachNeeded: false,
    parentContacted: false,
    followUpDueDate: null,
    contactNotes: null,

    graduationMilestones: [
      "Grade 7 graduation plan started",
      "High school credit opportunity identified",
      "Attendance goal met",
    ],
    nextReadinessStep: "Keep growth trend positive and continue planning milestones.",
    portfolioPreview: null,
  },
  {
    id: "liam-brown",
    name: "Liam Brown",
    grade: 9,
    homeroom: "Freshman Advisory",

    risk: "At Risk",
    readinessStatus: "off_track_credits",
    counselorNote: "Behind expected credit pace for freshman milestones.",

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
    creditsNeeded: 2,
    graduationPlanComplete: false,
    ninthGradeOnTrack: false,
    highSchoolCredits: 8,

    teacherWeeklyGoal: "Complete missing coursework for credit recovery.",
    studentWeeklyGoal: "Turn in two missing assignments by Friday.",
    weeklyGoalStatus: "in_progress",
    starsEarnedThisWeek: 2,
    attendanceStreak: 4,
    encouragementMessage: "You still have time to get back on track. Focus on one credit step this week.",
    rewardBadge: null,

    flagReasons: [
      "Credits earned below expected pace",
      "Freshman on-track milestone not met",
      "Graduation plan not complete",
    ],
    interventionStatus: "in_progress",
    interventionOwner: "Counselor Team",
    parentOutreachNeeded: true,
    parentContacted: true,
    followUpDueDate: "2026-04-25",
    contactNotes: "Parent contacted about missing work and freshman on-track recovery plan.",

    graduationMilestones: [
      "Freshman credit check needed",
      "Graduation plan incomplete",
      "Credit recovery plan started",
    ],
    nextReadinessStep: "Meet with counselor to finalize credit recovery and graduation plan.",
    portfolioPreview: {
      goals: ["Recover two credits", "Complete graduation plan"],
      workSamples: [],
      credentials: [],
      reflections: ["Needs to document freshman recovery plan"],
      futurePlans: ["Explore CTE pathway options in grade 10"],
    },
  },
  {
    id: "evelyn-phillips",
    name: "Evelyn Phillips",
    grade: 12,
    homeroom: "Senior Advisory",

    risk: "On Watch",
    readinessStatus: "college_career_watch",
    counselorNote: "Graduation on track; benchmarks and credential evidence still pending.",

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
    creditsNeeded: 2,
    graduationPlanComplete: true,
    ninthGradeOnTrack: true,
    highSchoolCredits: 42,

    teacherWeeklyGoal: "Upload one portfolio artifact tied to career readiness.",
    studentWeeklyGoal: "Finish credential evidence reflection.",
    weeklyGoalStatus: "not_started",
    starsEarnedThisWeek: 1,
    attendanceStreak: 3,
    encouragementMessage: "You are close to the finish line. Complete your readiness evidence this week.",
    rewardBadge: null,

    flagReasons: [
      "Credential evidence pending",
      "College/career benchmark evidence incomplete",
      "Portfolio needs final artifact",
    ],
    interventionStatus: "planned",
    interventionOwner: "Senior Advisor",
    parentOutreachNeeded: false,
    parentContacted: true,
    followUpDueDate: "2026-05-01",
    contactNotes: "Family aware of remaining portfolio and credential evidence items.",

    graduationMilestones: [
      "Graduation plan complete",
      "Senior credit review in progress",
      "Credential evidence pending",
      "Portfolio artifact needed",
    ],
    nextReadinessStep: "Submit credential evidence and final portfolio artifact.",
    portfolioPreview: {
      goals: ["Graduate on time", "Complete credential evidence", "Finalize career plan"],
      workSamples: ["Senior capstone outline", "Career interest reflection"],
      credentials: ["Credential evidence pending"],
      reflections: ["Career pathway reflection started"],
      futurePlans: ["Community college application", "Healthcare pathway interest"],
    },
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
