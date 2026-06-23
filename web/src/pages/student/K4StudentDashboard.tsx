import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  LogOut,
  Medal,
  Sparkles,
  Star,
  Target,
  Trophy,
  User2,
} from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import { DEMO_STUDENTS, type StudentRow } from "../../demo/demoData";

type K4CurrentUser = {
  email: string;
  role: string;
  district_id: number;
} | null;

type K4StudentDashboardProps = {
  demoStudent: StudentRow;
  currentUser: K4CurrentUser;
  logout: () => void;
  navigate: NavigateFunction;
  onChangeStudent: (name: string) => void;
  demoStudentName: string;
};

type BubbleKey = "attendance" | "reading" | "math";
type MoodKey = "happy" | "ready" | "tired" | "help";
type QuestKey = "showUp" | "reading" | "math";
type BuddyKey = "wiseOwl" | "rocketReader" | "mathDragon" | "starExplorer";

type BubbleTone = "emerald" | "sky" | "amber";

type BubbleDetail = {
  key: BubbleKey;
  label: string;
  value: string;
  percent: number;
  tone: BubbleTone;
  explanation: string;
  encouragement: string;
  nextStep: string;
};

type QuestDetail = {
  key: QuestKey;
  title: string;
  status: string;
  value: string;
  action: string;
  explanation: string;
  whyItMatters: string;
  nextAction: string;
  encouragement: string;
  tone: string;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreToBubblePercent(score: number | null) {
  if (score === null) {
    return 0;
  }

  return clampPercent((score / 250) * 100);
}

function statusLabel(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") {
    return "Quest complete";
  }

  if (status === "in_progress") {
    return "Quest in progress";
  }

  return "Ready to start";
}

function statusClassName(status: StudentRow["weeklyGoalStatus"]) {
  if (status === "complete") {
    return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }

  if (status === "in_progress") {
    return "bg-amber-100 text-amber-800 ring-amber-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function BubbleProgress({
  detail,
  selected,
  onSelect,
}: {
  detail: BubbleDetail;
  selected: boolean;
  onSelect: () => void;
}) {
  const toneClasses = {
    emerald: {
      ring: selected ? "ring-4 ring-emerald-300 shadow-lg shadow-emerald-100" : "ring-emerald-100",
      fill: "bg-emerald-400",
      text: "text-emerald-700",
      bg: selected ? "bg-emerald-50" : "bg-white/85",
    },
    sky: {
      ring: selected ? "ring-4 ring-sky-300 shadow-lg shadow-sky-100" : "ring-sky-100",
      fill: "bg-sky-400",
      text: "text-sky-700",
      bg: selected ? "bg-sky-50" : "bg-white/85",
    },
    amber: {
      ring: selected ? "ring-4 ring-amber-300 shadow-lg shadow-amber-100" : "ring-amber-100",
      fill: "bg-amber-400",
      text: "text-amber-700",
      bg: selected ? "bg-amber-50" : "bg-white/85",
    },
  }[detail.tone];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-3xl ${toneClasses.bg} p-5 text-left shadow-sm ring-1 ${toneClasses.ring} transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200`}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{detail.label}</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{detail.value}</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-bold ${toneClasses.text} bg-white/80 ring-1 ring-black/5`}>
          {selected ? "Popped!" : "Tap to pop"}
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100 ring-1 ring-black/5">
        <div className={`h-full rounded-full ${toneClasses.fill}`} style={{ width: `${detail.percent}%` }} />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">{detail.encouragement}</p>
    </button>
  );
}

export default function K4StudentDashboard({
  demoStudent,
  currentUser,
  logout,
  navigate,
  onChangeStudent,
  demoStudentName,
}: K4StudentDashboardProps) {
  const [selectedBubble, setSelectedBubble] = useState<BubbleKey>("attendance");
  const [selectedMood, setSelectedMood] = useState<MoodKey>("ready");
  const [selectedQuest, setSelectedQuest] = useState<QuestKey>("showUp");
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyKey>("wiseOwl");
  const [treasureChestOpened, setTreasureChestOpened] = useState(false);
  const [bubbleFeedback, setBubbleFeedback] = useState("Pop a bubble to check your power.");

  const firstName = demoStudent.name.split(" ")[0];
  const goalComplete = demoStudent.weeklyGoalStatus === "complete";
  const starTarget = 5;
  const starsTowardNextBadge =
    demoStudent.starsEarnedThisWeek % starTarget || (demoStudent.starsEarnedThisWeek > 0 ? starTarget : 0);
  const earnedCurrentBadge = demoStudent.rewardBadge ?? "First Badge";
  const treasureReady = demoStudent.starsEarnedThisWeek >= starTarget;
  const starsNeededForChest = Math.max(0, starTarget - demoStudent.starsEarnedThisWeek);
  const nextBadgeName = demoStudent.rewardBadge ? `${demoStudent.rewardBadge} upgrade` : "First Badge";

  const bubbleDetails: Record<BubbleKey, BubbleDetail> = {
    attendance: {
      key: "attendance",
      label: "Attendance",
      value: `${clampPercent(demoStudent.attendance)}%`,
      percent: clampPercent(demoStudent.attendance),
      tone: "emerald",
      explanation: "You are building a strong school streak. Keep showing up each day.",
      encouragement: `${demoStudent.attendanceStreak} day streak`,
      nextStep: "Try to add one more school day to your streak.",
    },
    reading: {
      key: "reading",
      label: "Reading",
      value: demoStudent.newaReading === null ? "Ready" : `${demoStudent.newaReading}`,
      percent: scoreToBubblePercent(demoStudent.newaReading),
      tone: "sky",
      explanation: "Reading practice helps unlock new levels.",
      encouragement: "Read a little each day",
      nextStep: "Choose one just-right book or passage and read for a few minutes.",
    },
    math: {
      key: "math",
      label: "Math",
      value: demoStudent.newaMath === null ? "Ready" : `${demoStudent.newaMath}`,
      percent: scoreToBubblePercent(demoStudent.newaMath),
      tone: "amber",
      explanation: "Math growth happens one skill at a time.",
      encouragement: "Keep solving",
      nextStep: "Practice one problem, check your thinking, and try one more.",
    },
  };

  const selectedDetail = bubbleDetails[selectedBubble];

  const moodOptions: Array<{
    key: MoodKey;
    label: string;
    icon: string;
    message: string;
    className: string;
  }> = [
    {
      key: "happy",
      label: "Happy",
      icon: "😊",
      message: `Love that energy, ${firstName}. Let it help you shine today.`,
      className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    },
    {
      key: "ready",
      label: "Ready",
      icon: "🚀",
      message: "You are ready for today's quest. Start with one small win.",
      className: "bg-sky-50 text-sky-800 ring-sky-200",
    },
    {
      key: "tired",
      label: "Tired",
      icon: "🌙",
      message: "Thanks for checking in. Take it one step at a time today.",
      className: "bg-violet-50 text-violet-800 ring-violet-200",
    },
    {
      key: "help",
      label: "Need help",
      icon: "💬",
      message: "Good choice speaking up. A grown-up can help you with the next step.",
      className: "bg-amber-50 text-amber-800 ring-amber-200",
    },
  ];

  const selectedMoodOption = moodOptions.find((mood) => mood.key === selectedMood) ?? moodOptions[1];

  const buddies: Array<{
    key: BuddyKey;
    name: string;
    icon: string;
    power: string;
    message: string;
    className: string;
  }> = [
    {
      key: "wiseOwl",
      name: "Wise Owl",
      icon: "🦉",
      power: "Careful thinking",
      message: "Wise Owl says: slow down, look closely, and trust your brain.",
      className: "bg-violet-50 text-violet-800 ring-violet-200",
    },
    {
      key: "rocketReader",
      name: "Rocket Reader",
      icon: "🚀",
      power: "Reading lift-off",
      message: "Rocket Reader says: every page can launch a new idea.",
      className: "bg-sky-50 text-sky-800 ring-sky-200",
    },
    {
      key: "mathDragon",
      name: "Math Dragon",
      icon: "🐉",
      power: "Problem solving",
      message: "Math Dragon says: try one strategy, then try another.",
      className: "bg-amber-50 text-amber-800 ring-amber-200",
    },
    {
      key: "starExplorer",
      name: "Star Explorer",
      icon: "⭐",
      power: "Brave effort",
      message: "Star Explorer says: one brave try can earn a bright star.",
      className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    },
  ];

  const selectedBuddyOption = buddies.find((buddy) => buddy.key === selectedBuddy) ?? buddies[0];

  const questDetails: Record<QuestKey, QuestDetail> = {
    showUp: {
      key: "showUp",
      title: "Show Up Quest",
      status: demoStudent.attendanceStreak > 0 ? "Streak active" : "Ready to begin",
      value: `${demoStudent.attendanceStreak} day streak`,
      action: "Come to school and keep your streak growing.",
      explanation: "Every day you show up, your streak gets stronger.",
      whyItMatters: "Being at school helps you practice reading, math, and friendship skills.",
      nextAction: "Pack what you need and be ready for tomorrow morning.",
      encouragement: `${firstName}, your school streak is a real superpower.`,
      tone: "emerald",
    },
    reading: {
      key: "reading",
      title: "Reading Quest",
      status: "Ready to read",
      value: demoStudent.newaReading === null ? "Practice time" : `${demoStudent.newaReading}`,
      action: demoStudent.studentWeeklyGoal,
      explanation: "Reading practice helps unlock new levels.",
      whyItMatters: "Reading helps you understand stories, directions, and ideas in every class.",
      nextAction: "Read one page, retell what happened, and celebrate the win.",
      encouragement: "Your reading power grows each time you practice.",
      tone: "sky",
    },
    math: {
      key: "math",
      title: "Math Quest",
      status: "Power growing",
      value: demoStudent.newaMath === null ? "Practice time" : `${demoStudent.newaMath}`,
      action: demoStudent.teacherWeeklyGoal,
      explanation: "Math power grows one skill at a time.",
      whyItMatters: "Math helps you solve puzzles, notice patterns, and explain your thinking.",
      nextAction: "Try one problem slowly and show your work.",
      encouragement: "Every math try counts.",
      tone: "amber",
    },
  };

  const selectedQuestDetail = questDetails[selectedQuest];
  const questTiles = [questDetails.showUp, questDetails.reading, questDetails.math];

  const badgeLocker = [
    { name: earnedCurrentBadge, status: "Earned", icon: "🏅", active: true },
    { name: "Reading Champion", status: "Locked", icon: "🔒", active: false },
    { name: "Math Explorer", status: "Locked", icon: "🔒", active: false },
    { name: "Attendance Hero", status: "Locked", icon: "🔒", active: false },
  ];

  const handleBubbleSelect = (bubble: BubbleKey) => {
    setSelectedBubble(bubble);
    setBubbleFeedback(
      bubble === "attendance"
        ? "Nice pop! You checked your Attendance Bubble."
        : bubble === "reading"
          ? "Nice pop! You checked your Reading Bubble."
          : "Math Bubble unlocked!",
    );
  };

  const treasureMessage = treasureReady
    ? treasureChestOpened
      ? `Treasure opened: ${earnedCurrentBadge} is shining in your badge locker.`
      : "Open your treasure chest!"
    : treasureChestOpened
      ? `Keep going, ${firstName}. ${starsNeededForChest} more ${
          starsNeededForChest === 1 ? "star" : "stars"
        } will unlock your chest.`
      : `${starsNeededForChest} more ${starsNeededForChest === 1 ? "star" : "stars"} to open the chest.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 text-slate-900">
      <header className="border-b border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3 text-left"
              aria-label="Go to home page"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Student Dashboard</p>
                <h1 className="text-xl font-black text-slate-900">Daily Progress Adventure</h1>
              </div>
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {currentUser ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-black/5">
                  <User2 className="h-4 w-4 text-emerald-600" />
                  {currentUser.email}
                </div>
              ) : null}

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:max-w-sm">
            <label htmlFor="k4-student-select" className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Demo student
            </label>
            <select
              id="k4-student-select"
              value={demoStudentName}
              onChange={(event) => onChangeStudent(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none ring-0 transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              {DEMO_STUDENTS.map((student) => (
                <option key={student.id} value={student.name}>
                  {student.name} - Grade {student.grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-white/85 p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Welcome back</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Hi, {firstName}!
              </h2>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
                Pick a power-up, pop a progress bubble, and finish today's quest one small win at a time.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Stars</p>
                <p className="mt-1 text-3xl font-black text-emerald-900">{demoStudent.starsEarnedThisWeek}</p>
              </div>
              <div className="rounded-3xl bg-sky-50 p-4 ring-1 ring-sky-100">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Streak</p>
                <p className="mt-1 text-3xl font-black text-sky-900">{demoStudent.attendanceStreak}</p>
              </div>
              <div className="rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-100">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Badge</p>
                <p className="mt-1 text-lg font-black text-amber-900">{earnedCurrentBadge}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Daily Check-In</p>
                <h2 className="text-xl font-black text-slate-900">How are you feeling?</h2>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.key}
                  type="button"
                  onClick={() => setSelectedMood(mood.key)}
                  className={`rounded-3xl p-4 text-center shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-rose-100 ${
                    selectedMood === mood.key ? `${mood.className} ring-4` : "bg-white text-slate-700 ring-black/5"
                  }`}
                  aria-pressed={selectedMood === mood.key}
                >
                  <div className="text-2xl" aria-hidden="true">
                    {mood.icon}
                  </div>
                  <div className="mt-2 text-sm font-black">{mood.label}</div>
                </button>
              ))}
            </div>

            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ring-1 ${selectedMoodOption.className}`}>
              {selectedMoodOption.message}
            </p>
          </div>

          <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Star Path</p>
                <h2 className="text-xl font-black text-slate-900">Reward Progress</h2>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
              {starsTowardNextBadge} of {starTarget} stars toward your next badge:{" "}
              <span className="font-black text-amber-700">{nextBadgeName}</span>.
            </p>

            <div className="mt-4 flex gap-2">
              {Array.from({ length: starTarget }, (_, index) => {
                const filled = index < starsTowardNextBadge;
                return (
                  <div
                    key={index}
                    className={`flex h-11 w-11 items-center justify-center rounded-full ring-1 ${
                      filled ? "bg-amber-300 text-amber-900 ring-amber-200" : "bg-slate-100 text-slate-300 ring-slate-200"
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Choose Your Buddy</p>
                <h2 className="text-xl font-black text-slate-900">Pick a power-up</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {buddies.map((buddy) => (
                <button
                  key={buddy.key}
                  type="button"
                  onClick={() => setSelectedBuddy(buddy.key)}
                  className={`rounded-3xl p-4 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 ${
                    selectedBuddy === buddy.key ? `${buddy.className} ring-4` : "bg-white text-slate-700 ring-black/5"
                  }`}
                  aria-pressed={selectedBuddy === buddy.key}
                >
                  <div className="text-3xl" aria-hidden="true">
                    {buddy.icon}
                  </div>
                  <p className="mt-3 text-sm font-black">{buddy.name}</p>
                  <p className="mt-1 text-xs font-semibold opacity-80">{buddy.power}</p>
                </button>
              ))}
            </div>

            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ring-1 ${selectedBuddyOption.className}`}>
              {selectedBuddyOption.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTreasureChestOpened(true)}
            className="rounded-3xl bg-white/85 p-5 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-amber-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-800">
                🧰
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Treasure Chest</p>
                <h2 className="text-xl font-black text-slate-900">{treasureReady ? "Ready to open" : "Still charging"}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{treasureMessage}</p>
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800 ring-1 ring-amber-100">
              {demoStudent.starsEarnedThisWeek} stars collected this week
            </div>
          </button>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Weekly Goal Quest</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">This week's goal</h2>
              </div>
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClassName(
                  demoStudent.weeklyGoalStatus,
                )}`}
              >
                {statusLabel(demoStudent.weeklyGoalStatus)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Teacher goal</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{demoStudent.teacherWeeklyGoal}</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-700">My goal</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{demoStudent.studentWeeklyGoal}</p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-3xl p-5 shadow-sm ring-1 ${
              goalComplete
                ? "bg-emerald-500 text-white ring-emerald-300"
                : "bg-white/85 text-slate-900 ring-black/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  goalComplete ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                }`}
              >
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${goalComplete ? "text-emerald-50" : "text-amber-700"}`}>
                  Celebration Station
                </p>
                <h2 className="text-xl font-black">{goalComplete ? "You finished the quest!" : "Keep going, you are close"}</h2>
              </div>
            </div>

            <p className={`mt-4 text-sm font-semibold leading-6 ${goalComplete ? "text-emerald-50" : "text-slate-700"}`}>
              {goalComplete
                ? `${firstName}, you earned ${demoStudent.starsEarnedThisWeek} stars this week. ${demoStudent.encouragementMessage}`
                : `${demoStudent.encouragementMessage} You already have ${demoStudent.starsEarnedThisWeek} stars this week.`}
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Progress Bubbles</p>
              <h2 className="text-2xl font-black text-slate-900">Pop a bubble to check your power</h2>
            </div>
            <p className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-800 ring-1 ring-sky-100">
              {bubbleFeedback}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {(Object.keys(bubbleDetails) as BubbleKey[]).map((bubble) => (
              <BubbleProgress
                key={bubble}
                detail={bubbleDetails[bubble]}
                selected={selectedBubble === bubble}
                onSelect={() => handleBubbleSelect(bubble)}
              />
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">Bubble popped</p>
            <h3 className="mt-1 text-2xl font-black">{selectedDetail.label} power</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">{selectedDetail.explanation}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Current value</p>
                <p className="mt-1 text-xl font-black">{selectedDetail.value}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Encouragement</p>
                <p className="mt-1 text-sm font-semibold leading-6">{selectedDetail.encouragement}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Next step</p>
                <p className="mt-1 text-sm font-semibold leading-6">{selectedDetail.nextStep}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Daily Quest Board</p>
              <h2 className="text-2xl font-black text-slate-900">Choose your next quest</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {questTiles.map((quest) => {
              const selected = selectedQuest === quest.key;
              const Icon = quest.key === "showUp" ? CalendarCheck : quest.key === "reading" ? Sparkles : Target;

              return (
                <button
                  key={quest.key}
                  type="button"
                  onClick={() => setSelectedQuest(quest.key)}
                  className={`rounded-3xl p-5 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                    selected ? "bg-emerald-50 ring-4 ring-emerald-200" : "bg-white ring-black/5"
                  }`}
                  aria-pressed={selected}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 ring-1 ring-black/5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{quest.title}</h3>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{quest.status}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-black text-slate-900">{quest.value}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{quest.action}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl bg-slate-900 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-200">Quest details</p>
            <h3 className="mt-1 text-2xl font-black">{selectedQuestDetail.title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">{selectedQuestDetail.explanation}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Current status</p>
                <p className="mt-1 text-sm font-semibold leading-6">{selectedQuestDetail.value}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Why it matters</p>
                <p className="mt-1 text-sm font-semibold leading-6">{selectedQuestDetail.whyItMatters}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Next action</p>
                <p className="mt-1 text-sm font-semibold leading-6">{selectedQuestDetail.nextAction}</p>
              </div>
            </div>

            <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-emerald-100">
              {selectedQuestDetail.encouragement}
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white/85 p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Medal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Badge Locker</p>
              <h2 className="text-2xl font-black text-slate-900">Badges you can collect</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badgeLocker.map((badge) => (
              <div
                key={badge.name}
                className={`rounded-3xl p-5 text-center shadow-sm ring-1 ${
                  badge.active
                    ? "bg-emerald-50 text-emerald-900 ring-emerald-100"
                    : "bg-slate-50 text-slate-500 ring-slate-200"
                }`}
              >
                <div className="text-3xl" aria-hidden="true">
                  {badge.icon}
                </div>
                <p className="mt-3 text-sm font-black">{badge.name}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide">{badge.status}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
