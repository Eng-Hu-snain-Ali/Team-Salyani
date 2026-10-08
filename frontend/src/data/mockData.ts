import type {
  User,
  SkillData,
  Challenge,
  Achievement,
  NotificationItem,
  OnboardingAssessmentQuestion,
} from '../types';

// ============================================================================
// 1. DEFAULT ACTIVE USER
// ============================================================================
export const INITIAL_USER: User = {
  id: 'usr_ustad_demo',
  name: 'Ali Rehman',
  email: 'ali.rehman@ustadonline.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  currentLevel: 3,
  xp: 420,
  nextLevelXp: 600,
  streakDays: 5,
  longestStreak: 9,
  weeklyActivity: [
    { day: 'Mon', date: '2026-10-05', active: true },
    { day: 'Tue', date: '2026-10-06', active: true },
    { day: 'Wed', date: '2026-10-07', active: true },
    { day: 'Thu', date: '2026-10-08', active: true },
    { day: 'Fri', date: '2026-10-09', active: true },
    { day: 'Sat', date: '2026-10-10', active: false },
    { day: 'Sun', date: '2026-10-11', active: false },
  ],
  ageGroup: '20-24',
  learningGoals: [
    'Stop overspending & build an emergency reserve',
    'Overcome procrastination & manage conflicting deadlines',
    'Make confident life decisions despite uncertainty',
  ],
  onboardingCompleted: true,
  notificationPreferences: {
    dailyReminders: true,
    streakAlerts: true,
    weeklyReport: false,
  },
  createdAt: '2026-09-15T08:00:00Z',
};

// ============================================================================
// 2. THE FIVE CORE LIFE SKILLS
// ============================================================================
export const INITIAL_SKILLS: SkillData[] = [
  {
    id: 'decision-making',
    name: 'Decision Making',
    shortName: 'Decisions',
    icon: 'Compass',
    color: '#2563EB',
    description: 'Evaluating trade-offs, separating emotional impulses from rational criteria, and committing decisively.',
    score: 68,
    level: 3,
    levelTitle: 'Pragmatic Strategist',
    strengths: [
      'Strong awareness of long-term opportunity costs',
      'Good at identifying hidden assumptions before acting',
    ],
    areasToImprove: [
      'Tendency to over-analyze small reversible choices',
      'Can hesitate under ambiguous social expectations',
    ],
    history: [
      { date: 'Yesterday', delta: +6, challengeTitle: 'Career Pivot Dilemma' },
      { date: '3 days ago', delta: +4, challengeTitle: 'Choosing Between Short & Long Term' },
    ],
  },
  {
    id: 'money-management',
    name: 'Money Management',
    shortName: 'Money',
    icon: 'Wallet',
    color: '#16A34A',
    description: 'Budgeting with limited capital, avoiding debt traps, resisting impulse spending, and maintaining safety buffers.',
    score: 54,
    level: 2,
    levelTitle: 'Budget Apprentice',
    strengths: [
      'Understands the concept of emergency cash cushions',
      'Proactively questions subscription leakages',
    ],
    areasToImprove: [
      'Vulnerable to emotional compensatory spending under stress',
      'Hesitant to negotiate recurring fixed bills',
    ],
    history: [
      { date: '2 days ago', delta: +8, challengeTitle: 'The Broken Laptop Budget Crunch' },
    ],
  },
  {
    id: 'time-management',
    name: 'Time Management',
    shortName: 'Time',
    icon: 'Clock',
    color: '#F59E0B',
    description: 'Ruthless prioritization, deep focus protection, scheduling sanity, and conquering the urge to multitask.',
    score: 62,
    level: 3,
    levelTitle: 'Focus Adept',
    strengths: [
      'Consistently uses time-blocking for high-impact tasks',
      'Understands the 80/20 Pareto principle',
    ],
    areasToImprove: [
      'Underestimates buffer time needed between high-friction tasks',
      'Says yes too quickly to urgent but low-importance demands',
    ],
    history: [
      { date: 'Today', delta: +5, challengeTitle: 'The 3 Urgent Deadlines Dilemma' },
      { date: '4 days ago', delta: +7, challengeTitle: 'Calendar Defense System' },
    ],
  },
  {
    id: 'communication',
    name: 'Communication',
    shortName: 'Communication',
    icon: 'MessageSquare',
    color: '#7C3AED',
    description: 'Direct and empathetic expression, handling friction without defensiveness, clear boundary enforcement.',
    score: 75,
    level: 4,
    levelTitle: 'Constructive Diplomat',
    strengths: [
      'De-escalates tense debates using active listening',
      'States the bottom line clearly before context',
    ],
    areasToImprove: [
      'Can soften boundaries too much to preserve harmony',
      'Needs practice delivering tough feedback upwards',
    ],
    history: [
      { date: 'Today', delta: +6, challengeTitle: 'Public Disagreement in Team Meeting' },
      { date: '5 days ago', delta: +9, challengeTitle: 'Setting Firm Client Boundaries' },
    ],
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    shortName: 'Problem Solving',
    icon: 'Cpu',
    color: '#0891B2',
    description: 'Breaking complex chaos into concrete sub-problems, finding root causes, and testing small reversible solutions.',
    score: 58,
    level: 2,
    levelTitle: 'Systematic Thinker',
    strengths: [
      'Good at isolating variables rather than panicking',
      'Recognizes circular logic and unverified rumors',
    ],
    areasToImprove: [
      'Jumps to implementing fixes before verifying the root problem',
      'Needs more practice under strict time constraints',
    ],
    history: [
      { date: '3 days ago', delta: +5, challengeTitle: 'Production Crash 1 Hour Before Launch' },
    ],
  },
];

// ============================================================================
// 3. REALISTIC INTERACTIVE CHALLENGES
// ============================================================================
export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch_01',
    title: 'The 3 Urgent Deadlines Dilemma',
    category: 'time-management',
    difficulty: 'Intermediate',
    estimatedMinutes: 3,
    xpReward: 50,
    isDaily: true,
    summary: 'It is 2:00 PM. Three high-stakes stakeholders are demanding immediate deliverables by 5:00 PM. You cannot finish all three.',
    scenarioContext: `You are managing an operational project. At 2:00 PM on Thursday, three critical tasks collide:
1. Your manager asks for a revised budget presentation for an executive meeting tomorrow at 9:00 AM.
2. A high-value client emails stating their invoice contains an overcharge error and demands an immediate recalculation before paying.
3. Your closest teammate is blocked on a deployment pipeline error that requires 40 minutes of your technical expertise.

You have exactly 3 hours of uninterrupted focus before mandatory office closure. Attempting all three simultaneously will result in rushed mistakes and missed deadlines across the board.`,
    dilemma: 'How do you triage this workload without destroying stakeholder trust or burning out?',
    options: [
      {
        id: 'A',
        label: 'Work in panic mode, splitting 1 hour per task',
        description: 'Try to rush through all three tasks by context-switching rapidly every 40-60 minutes.',
        consequence: 'By 5:00 PM, the budget slides contain typos, the client invoice correction missed a tax deduction, and your teammate was only partially unblocked. All three stakeholders are disappointed.',
        feedback: 'Context switching degrades cognitive capacity by up to 40%. Rushing three tasks simultaneously creates hidden compound errors that take triple the time to fix the next morning.',
        skillImpact: { skill: 'time-management', delta: -2 },
        isOptimal: false,
      },
      {
        id: 'B',
        label: 'Triage by true external urgency: Client first, align manager second, hand off teammate',
        description: 'Call the client immediately (15 mins) to verify the error and promise the revised invoice by 4:00 PM. Update your manager with an outline and negotiate final delivery for 8:30 AM tomorrow. Direct your teammate to documentation for 1 hour.',
        consequence: 'The client receives an accurate invoice and pays promptly. Your manager appreciates the proactive communication and agrees to the 8:30 AM delivery. Your teammate resolves part of the bug independently.',
        feedback: 'Outstanding prioritization! You separated "false urgency" from "actual business impact" and proactively renegotiated deadlines before missing them.',
        skillImpact: { skill: 'time-management', delta: +6 },
        isOptimal: true,
      },
      {
        id: 'C',
        label: 'Shut off all notifications and focus exclusively on the manager\'s deck',
        description: 'Prioritize your direct superior above all else. Ignore the client and teammate until tomorrow morning.',
        consequence: 'Your manager gets a polished deck, but the angry client escalates to your company director over the unaddressed overcharge, causing an unnecessary leadership crisis.',
        feedback: 'While pleasing your manager is important, ignoring an active billing dispute with a paying customer creates severe organizational risk. Silence is perceived as negligence.',
        skillImpact: { skill: 'time-management', delta: +1 },
        isOptimal: false,
      },
      {
        id: 'D',
        label: 'Drop everything to pair-program with your teammate first',
        description: 'Help your colleague through the deployment issue because team culture and loyalty come first.',
        consequence: 'Your teammate is grateful, but neither the manager\'s deck nor the client invoice is addressed. You face disciplinary reprimand for neglecting primary responsibilities.',
        feedback: 'High empathy, but poor organizational stewardship. Helping others at the complete expense of your core duties harms both you and the organization.',
        skillImpact: { skill: 'time-management', delta: 0 },
        isOptimal: false,
      },
    ],
    allowWrittenResponse: true,
    recommendedReason: 'Recommended today because Time Management is your most active growth skill this week.',
    completed: true,
    completedAt: '2026-10-09T01:15:00Z',
    userChoiceId: 'B',
    userWrittenResponse: 'I chose B because proactive renegotiation is better than silent failure.',
    tags: ['Prioritization', 'Workplace Urgency', 'Context Switching'],
  },
  {
    id: 'ch_02',
    title: 'The Rent vs Broken Laptop Budget Crunch',
    category: 'money-management',
    difficulty: 'Intermediate',
    estimatedMinutes: 4,
    xpReward: 60,
    isDaily: false,
    summary: 'You have $900 in checking. Rent of $750 is due in 3 days. Your laptop—your only work tool—just motherboard-fried and repairs cost $450.',
    scenarioContext: `You are working as an independent freelance contractor or remote worker. Your entire monthly income ($2,200) depends on having a functioning computer.

On the 28th of the month:
- Rent due on the 1st: $750 (Strict 10% late fee if unpaid by the 3rd).
- Cash available: $900.
- Laptop completely dead: Certified repair estimate is $450 (ready in 2 days) or a refurbished loaner is $120/month.
- A client owes you $800, but their payment is scheduled for the 10th of next month.

You have no credit card with remaining limit, and taking a high-interest payday loan charges 35% fees.`,
    dilemma: 'How do you preserve shelter and protect your ability to earn without spiraling into toxic debt?',
    options: [
      {
        id: 'A',
        label: 'Spend $450 on immediate laptop repair and pay partial rent late',
        description: 'Fix the laptop right away with cash, pay $450 towards rent, and hope the landlord forgives the late fee.',
        consequence: 'Your laptop is fixed, but the landlord issues a formal lease violation notice and applies a $75 penalty. You are now behind on living costs with zero safety cushion.',
        feedback: 'Paying rent late without prior agreement triggers landlord friction and penalties. Shelter security must always be protected through clear communication.',
        skillImpact: { skill: 'money-management', delta: +1 },
        isOptimal: false,
      },
      {
        id: 'B',
        label: 'Pay full rent ($750), use $150 remaining for a refurbished rental / library setup, and invoice the client with an early-pay discount',
        description: 'Secure shelter first. Rent a basic working laptop for $80 or use campus/co-working stations for 5 days. Offer your pending client a 5% discount if they clear the $800 invoice 5 days early.',
        consequence: 'Rent is paid with zero penalties. The client accepts the small early-payment discount and pays $760 within 48 hours, allowing you to pay for the permanent repair with zero high-interest debt!',
        feedback: 'Brilliant financial engineering! You prioritized non-negotiable living security, avoided predatory debt, created a temporary workaround, and pulled forward receivables.',
        skillImpact: { skill: 'money-management', delta: +8 },
        isOptimal: true,
      },
      {
        id: 'C',
        label: 'Take a quick payday advance / informal high-interest loan to cover both',
        description: 'Borrow $400 at 30% monthly interest so you don\'t have to compromise on either rent or machine.',
        consequence: 'Both problems seem solved on day 1, but the $120 interest fee traps your upcoming paycheck, leaving you in an escalating cash deficit next month.',
        feedback: 'Payday and high-interest micro-loans are wealth destroyers. Short-term relief turns into months of compound financial stress.',
        skillImpact: { skill: 'money-management', delta: -5 },
        isOptimal: false,
      },
      {
        id: 'D',
        label: 'Do not pay rent, do not fix laptop, and wait until the client pays on the 10th',
        description: 'Freeze all spending and simply stop working for two weeks until funds arrive.',
        consequence: 'You miss client deadlines, risk losing future contracts, and accumulate severe landlord friction.',
        feedback: 'Financial paralysis is not risk management. Passively waiting while revenue halts compounds both income loss and housing instability.',
        skillImpact: { skill: 'money-management', delta: -3 },
        isOptimal: false,
      },
    ],
    allowWrittenResponse: true,
    recommendedReason: 'Recommended to strengthen your emergency cash flow resilience and debt avoidance tactics.',
    completed: false,
    tags: ['Cashflow', 'Emergency Fund', 'Negotiation', 'Receivables'],
  },
  {
    id: 'ch_03',
    title: 'Responding to Public Disagreement in a Team Meeting',
    category: 'communication',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    xpReward: 40,
    isDaily: false,
    summary: 'During an all-hands product review, a senior colleague bluntly calls your proposal "unrealistic and a waste of engineering time".',
    scenarioContext: `You have spent 2 weeks preparing a user onboarding revision proposal. In the meeting with 12 team members present, right after you present slide 4, a senior engineer speaks over you:
"Look, this proposal is completely detached from reality. We cannot build this, and frankly it's a waste of engineering time to even discuss it right now."

Several colleagues glance awkwardly at their screens. The room goes silent, and the meeting chair looks at you to see how you will react. You feel a surge of anger and embarrassment.`,
    dilemma: 'How do you respond in the moment to maintain professional authority without escalating into petty defensiveness or shrinking away?',
    options: [
      {
        id: 'A',
        label: 'Clap back immediately: "If you actually read the technical specs beforehand, you would know this is standard."',
        description: 'Defend your competence by pointing out their failure to review materials before the meeting.',
        consequence: 'The room becomes intensely hostile. The meeting chair intervenes to stop the argument. Colleagues remember the clash rather than the merits of your proposal.',
        feedback: 'Public counter-attacks make you look emotionally defensive. Even if factually correct, escalating defensiveness in front of leaders damages executive presence.',
        skillImpact: { skill: 'communication', delta: -3 },
        isOptimal: false,
      },
      {
        id: 'B',
        label: 'Acknowledge technical concern, separate emotion, and ask for specific constraint details',
        description: 'Take a calm breath and say: "I appreciate you flagging feasibility early, Tariq. Which specific part of the flow do you see as the highest engineering roadblock? Let\'s note those constraints right now."',
        consequence: 'The tension immediately dissipates. The engineer is forced to shift from vague emotional dismissals to concrete technical details. You look poised, collaborative, and in total control of the room.',
        feedback: 'Masterful conversational Aikido! You validated their right to raise concerns, neutralized their hostility, and refocused the conversation from personal insults to objective technical constraints.',
        skillImpact: { skill: 'communication', delta: +7 },
        isOptimal: true,
      },
      {
        id: 'C',
        label: 'Apologize profusely and offer to scrap the proposal immediately',
        description: 'Avoid all conflict by backing down: "I\'m so sorry, maybe I was mistaken, let\'s move on to the next topic."',
        consequence: 'The proposal is discarded. Colleagues assume your work was indeed careless, and your confidence takes a severe hit.',
        feedback: 'Conflict avoidance at the cost of your legitimate work signals low conviction. Constructive disagreement is healthy; immediate capitulation undermines credibility.',
        skillImpact: { skill: 'communication', delta: -2 },
        isOptimal: false,
      },
      {
        id: 'D',
        label: 'Stay completely silent and look at the floor until someone else speaks',
        description: 'Refuse to engage and let the awkward silence force the meeting chair to intervene.',
        consequence: 'The meeting chair awkwardly changes the subject. The dismissal goes unaddressed, leaving an impression of helplessness.',
        feedback: 'Silence in the face of public criticism forfeits your platform. You don\'t need to fight, but you must acknowledge and steer the dialogue.',
        skillImpact: { skill: 'communication', delta: 0 },
        isOptimal: false,
      },
    ],
    allowWrittenResponse: true,
    recommendedReason: 'Recommended to develop diplomatic de-escalation and professional poise under scrutiny.',
    completed: false,
    tags: ['De-escalation', 'Executive Presence', 'Workplace Conflict'],
  },
  {
    id: 'ch_04',
    title: 'The High-Salary Safe Job vs High-Equity Startup Offer',
    category: 'decision-making',
    difficulty: 'Advanced',
    estimatedMinutes: 5,
    xpReward: 70,
    isDaily: false,
    summary: 'You have two offers: Offer A pays $95k with strict routine; Offer B pays $60k with 1.5% equity and steep learning curve.',
    scenarioContext: `You are 24 years old with minimal student debt and 6 months of living expenses saved.

Offer A (Legacy Enterprise):
- Base salary: $95,000 + 401(k) match.
- Stability: High. Little risk of layoffs.
- Scope: Maintenance of existing internal tooling. Slow promotion cycle (2-3 years per step).
- Learning: Low to medium. Modern frameworks are rarely adopted.

Offer B (Seed-stage YC Startup):
- Base salary: $60,000 + 1.5% vested equity.
- Stability: Low. Company has 14 months of runway.
- Scope: You will own the entire customer-facing product architecture.
- Learning: Exponential. You will interact with customers, ship weekly, and work directly with serial founders.`,
    dilemma: 'How do you structure this life decision based on your stage of life and asymmetric upside vs downside risk?',
    options: [
      {
        id: 'A',
        label: 'Take Offer A solely because $95k is higher than $60k right now',
        description: 'Maximize current year cash earnings without weighing long-term career capital or skills velocity.',
        consequence: 'You have comfortable disposable income, but after 3 years you realize your skill set has stagnated and moving to modern tech roles is harder than anticipated.',
        feedback: 'Early in your career, skills velocity and compounding network value often dwarf small early salary differentials. Don\'t optimize for cash over compounding competency too early.',
        skillImpact: { skill: 'decision-making', delta: +2 },
        isOptimal: false,
      },
      {
        id: 'B',
        label: 'Apply an Asymmetric Risk & Regret Minimization Framework to your financial baseline',
        description: 'Evaluate worst-case vs best-case: Since you have 6 months of savings and low fixed liabilities, the downside of Offer B (startup folds in 14 mos) leaves you with elite full-stack experience and network. The downside of Offer A is 3 years of career plateau.',
        consequence: 'You negotiate Offer B to $65k with milestone review. Whether the startup succeeds or fails, within 18 months your market value jumps to $120k+ due to proven product ownership.',
        feedback: 'Exceptional decision framework! You evaluated personal downside tolerance (low liabilities, existing runway) against career upside asymmetry rather than nominal salary vanity.',
        skillImpact: { skill: 'decision-making', delta: +8 },
        isOptimal: true,
      },
      {
        id: 'C',
        label: 'Flip a coin or poll 20 friends on Instagram to see what majority votes',
        description: 'Delegate personal career agency to public opinion polls.',
        consequence: 'You receive conflicting advice from people who don\'t understand your personal risk tolerance, leaving you more paralyzed than before.',
        feedback: 'Crowdsourcing high-stakes decisions is an evasion of personal agency. Only you bear the consequences of your life choices.',
        skillImpact: { skill: 'decision-making', delta: -4 },
        isOptimal: false,
      },
      {
        id: 'D',
        label: 'Try to secretly work both full-time jobs remotely simultaneously',
        description: 'Accept both offers and hope nobody notices your conflicting meetings.',
        consequence: 'Within 3 weeks, meeting calendar collisions result in missed client presentations. Both companies fire you for breach of contract and conduct violations.',
        feedback: 'Dishonest overemployment under pressure destroys your reputation and network integrity. Trust is the hardest asset to rebuild.',
        skillImpact: { skill: 'decision-making', delta: -8 },
        isOptimal: false,
      },
    ],
    allowWrittenResponse: true,
    recommendedReason: 'Recommended to teach asymmetrical upside analysis and regret minimization frameworks.',
    completed: false,
    tags: ['Risk Asymmetry', 'Regret Minimization', 'Career Strategy'],
  },
  {
    id: 'ch_05',
    title: 'Production Crash 1 Hour Before Product Launch',
    category: 'problem-solving',
    difficulty: 'Advanced',
    estimatedMinutes: 5,
    xpReward: 65,
    isDaily: false,
    summary: '60 minutes before 10,000 public users arrive for launch, payment gateway webhooks fail with Error 500 across all testing accounts.',
    scenarioContext: `Your team has hyped a product launch for 3 months. Marketing campaigns and press releases go live at 10:00 AM.
At 8:55 AM, automated test suites trigger red alerts:
- 100% of Stripe test checkout transactions are returning HTTP 500.
- A junior developer merged 4 different pull requests at 8:30 AM containing database index updates, email copy fixes, and payment webhook secret rotations.
- The marketing director is messaging every 2 minutes: "Are we still on track? Do not delay without warning!"`,
    dilemma: 'Under severe time pressure, how do you diagnose the root cause and execute a recovery plan without causing worse secondary disasters?',
    options: [
      {
        id: 'A',
        label: 'Start randomly editing environment variables and pushing hotfixes directly to main',
        description: 'Panic fix lines of code in production directly in the cloud console to see if it starts working.',
        consequence: 'The ad-hoc changes corrupt the database migration state. Now not only are payments failing, but the user registration table is locked.',
        feedback: 'Under pressure, random intervention without structured diagnosis accelerates catastrophe. Never debug through hasty blind edits.',
        skillImpact: { skill: 'problem-solving', delta: -4 },
        isOptimal: false,
      },
      {
        id: 'B',
        label: 'Execute systematic rollback to the last verified stable commit, isolate the webhook diff, and send an upfront status broadcast',
        description: 'Immediately revert the 8:30 AM batch merge to restore known stability. Test payments on the reverted build (takes 10 mins). Inform marketing leadership calmly of the 15-minute verification buffer.',
        consequence: 'The instant rollback fixes payments immediately. By 9:25 AM, the stable build is verified green. You isolate the bug (an unescaped webhook signing secret) in a clean staging branch for later deployment.',
        feedback: 'Flawless incident response! You prioritized "known safe state via rollback" over blind debugging, isolated variables, and communicated calmly to stakeholders.',
        skillImpact: { skill: 'problem-solving', delta: +9 },
        isOptimal: true,
      },
      {
        id: 'C',
        label: 'Blame the junior developer publicly in Slack and demand they fix their commits',
        description: 'Direct accountability to whoever merged last and refuse to intervene.',
        consequence: 'The junior developer freezes under panic. Time runs out, launch fails in public view, and team trust is permanently fractured.',
        feedback: 'Blame during an active crisis guarantees failure. Blameless incident post-mortems happen AFTER the fire is extinguished.',
        skillImpact: { skill: 'problem-solving', delta: -6 },
        isOptimal: false,
      },
      {
        id: 'D',
        label: 'Proceed with the launch anyway and plan to refund whoever encounters an error',
        description: 'Ignore the test suite failures and hope real users don\'t trigger the bug.',
        consequence: 'Thousands of users fail checkout simultaneously, flooding social media with scam allegations. The brand reputation is ruined on day one.',
        feedback: 'Launching knowingly broken mission-critical flows (especially payments) is professional suicide. Controlled short delays are always preferable to broken core transactions.',
        skillImpact: { skill: 'problem-solving', delta: -5 },
        isOptimal: false,
      },
    ],
    allowWrittenResponse: true,
    recommendedReason: 'Recommended to train systematic root cause isolation under extreme time constraints.',
    completed: false,
    tags: ['Incident Response', 'Root Cause', 'Rollback Strategy'],
  },
  {
    id: 'ch_06',
    title: 'The Sunk Cost Gym Membership vs Home Habit',
    category: 'money-management',
    difficulty: 'Beginner',
    estimatedMinutes: 3,
    xpReward: 35,
    isDaily: false,
    summary: 'You prepaid $600 for an annual luxury gym membership 4 months ago, but have only visited 3 times due to long commute.',
    scenarioContext: `In January, inspired by new year motivation, you signed a non-refundable $600/year contract ($50/month effective).
Now in May, reality has set in:
- The gym is a 35-minute drive in peak traffic.
- Every time you plan to go, the travel time causes you to procrastinate and skip entirely.
- A friend suggests a $25 resistance band set and free park runs, which you actually enjoy.
- You keep telling yourself: "I spent $600! I must force myself to drive 35 minutes!"`,
    dilemma: 'How do you overcome the psychological trap of sunk costs to optimize health and financial peace?',
    options: [
      {
        id: 'A',
        label: 'Keep feeling guilty and forcing yourself once every 3 weeks to justify the $600',
        description: 'Continue the current painful pattern because acknowledging the wasted money feels too painful.',
        consequence: 'You spend another 7 months feeling guilty, exercising infrequently, and gaining no physical health benefits.',
        feedback: 'The classic Sunk Cost Fallacy: spending emotional energy and future time trying to salvage money that is already gone forever.',
        skillImpact: { skill: 'money-management', delta: -1 },
        isOptimal: false,
      },
      {
        id: 'B',
        label: 'Accept the $600 as a closed tuition fee, explore contract transfer, and start the home routine today',
        description: 'Acknowledge the money is already spent. Check if the gym contract permits member transfer/sublet to someone living closer. Switch immediately to the high-consistency home routine.',
        consequence: 'You transfer the remaining 7 months of contract to a coworker for $250 recovery, and your workout consistency jumps to 4 days per week at home!',
        feedback: 'Exemplary financial and behavioral clarity! Sunk costs cannot be retrieved; only future friction and marginal utility matter.',
        skillImpact: { skill: 'money-management', delta: +6 },
        isOptimal: true,
      },
      {
        id: 'C',
        label: 'Buy $400 more luxury gym apparel to motivate yourself to make the commute',
        description: 'Double down on the investment to force enthusiasm.',
        consequence: 'You are now out $1,000 and still hate the 35-minute commute.',
        feedback: 'Throwing good money after bad is a dangerous habit. Gear rarely solves environmental friction.',
        skillImpact: { skill: 'money-management', delta: -4 },
        isOptimal: false,
      },
      {
        id: 'D',
        label: 'Give up on fitness entirely until the contract expires in December',
        description: 'Quit working out out of frustration with the gym commitment.',
        consequence: 'Physical and mental health deteriorate while the $600 continues to waste away.',
        feedback: 'Never sacrifice foundational well-being because of an imperfect financial choice.',
        skillImpact: { skill: 'money-management', delta: -2 },
        isOptimal: false,
      },
    ],
    allowWrittenResponse: false,
    recommendedReason: 'Recommended to diagnose cognitive biases like the Sunk Cost Fallacy.',
    completed: false,
    tags: ['Sunk Cost', 'Behavioral Economics', 'Habit Friction'],
  },
];

// ============================================================================
// 4. ACHIEVEMENTS SYSTEM
// ============================================================================
export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_step',
    title: 'First Decision',
    description: 'Complete your first interactive real-life scenario.',
    category: 'general',
    icon: 'Award',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-10-09T01:15:00Z',
  },
  {
    id: 'ach_streak_5',
    title: 'Consistency Builder',
    description: 'Maintain a 5-day active learning streak.',
    category: 'general',
    icon: 'Flame',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedAt: '2026-10-09T01:15:00Z',
  },
  {
    id: 'ach_prioritizer',
    title: 'Master Prioritizer',
    description: 'Solve 3 Time Management challenges with optimal triage decisions.',
    category: 'time-management',
    icon: 'Clock',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: 'ach_budget_guard',
    title: 'Financial Shield',
    description: 'Prevent high-interest debt and balance cashflow under pressure.',
    category: 'money-management',
    icon: 'ShieldCheck',
    unlocked: false,
    progress: 0,
    maxProgress: 2,
  },
  {
    id: 'ach_diplomat',
    title: 'Calm Diplomat',
    description: 'De-escalate workplace conflict and preserve stakeholder alignment.',
    category: 'communication',
    icon: 'MessageSquare',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: 'ach_root_cause',
    title: 'Root Cause Detective',
    description: 'Solve an advanced crisis without creating secondary failures.',
    category: 'problem-solving',
    icon: 'Cpu',
    unlocked: false,
    progress: 0,
    maxProgress: 2,
  },
  {
    id: 'ach_level_5',
    title: 'Life Strategist',
    description: 'Reach Level 5 and accumulate 1,000 XP in practical wisdom.',
    category: 'general',
    icon: 'Zap',
    unlocked: false,
    progress: 420,
    maxProgress: 1000,
  },
];

// ============================================================================
// 5. ONBOARDING DIAGNOSTIC ASSESSMENT
// ============================================================================
export const ONBOARDING_ASSESSMENT_QUESTIONS: OnboardingAssessmentQuestion[] = [
  {
    id: 'diag_01',
    category: 'time-management',
    title: 'Workload Diagnostic',
    scenario: 'You planned to study or work for 3 hours on Sunday evening, but a close friend calls in emotional distress and asks you to meet for coffee.',
    options: [
      {
        id: 'opt_1',
        label: 'Drop everything and spend 3 hours with them, sacrificing your study plan completely.',
        description: 'Prioritizes emotional empathy, but sacrifices your non-negotiable personal commitments.',
        skillImpacts: { 'communication': +4, 'time-management': -4 },
      },
      {
        id: 'opt_2',
        label: 'Offer a focused 30-minute listening call now, then schedule a proper meetup on Tuesday after your deadlines.',
        description: 'Boundaries with compassion: provides immediate support while guarding core focus blocks.',
        skillImpacts: { 'communication': +8, 'time-management': +8, 'decision-making': +6 },
      },
      {
        id: 'opt_3',
        label: 'Ignore the call and send a short text saying you are too busy.',
        description: 'Protects time ruthlessly, but damages social capital and relationship warmth.',
        skillImpacts: { 'time-management': +2, 'communication': -6 },
      },
    ],
  },
  {
    id: 'diag_02',
    category: 'money-management',
    title: 'Financial Buffer Diagnostic',
    scenario: 'You receive an unexpected $400 bonus at the end of the month. Your checking account has $80 in buffer.',
    options: [
      {
        id: 'opt_1',
        label: 'Treat yourself to dinner and gadgets with the full $400 as a well-deserved reward.',
        description: 'Immediate dopamine reward, but leaves you one flat tire away from debt.',
        skillImpacts: { 'money-management': -5, 'decision-making': -3 },
      },
      {
        id: 'opt_2',
        label: 'Put $350 immediately into an untouchable emergency buffer, spend $50 on a small celebration.',
        description: 'Balances psychological satisfaction with building antifragile financial resilience.',
        skillImpacts: { 'money-management': +10, 'decision-making': +8 },
      },
      {
        id: 'opt_3',
        label: 'Put all $400 into a high-risk crypto coin hoping to turn it into $2,000.',
        description: 'Treats critical base liquidity as speculative gambling capital.',
        skillImpacts: { 'money-management': -8, 'problem-solving': -4 },
      },
    ],
  },
];

// ============================================================================
// 6. NOTIFICATIONS
// ============================================================================
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: "Today's Scenario is Ready",
    message: 'The 3 Urgent Deadlines Dilemma: Practice prioritizing high-friction tasks before 5 PM.',
    type: 'daily',
    targetChallengeId: 'ch_01',
    isRead: false,
    createdAt: '2 hours ago',
  },
  {
    id: 'notif_02',
    title: '5-Day Streak Maintained! 🔥',
    message: 'You have solved a practical scenario every day since Monday. Keep the momentum going.',
    type: 'streak',
    isRead: false,
    createdAt: 'Yesterday',
  },
  {
    id: 'notif_03',
    title: 'Achievement Unlocked: First Decision',
    message: 'You earned your first decision badge and gained +50 XP in Time Management.',
    type: 'achievement',
    isRead: true,
    createdAt: '3 days ago',
  },
];
