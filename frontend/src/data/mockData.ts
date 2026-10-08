import type {
  Experience,
  Notification,
  User,
  TeamMember,
  ExploreVideo,
  ExploreIdea,
} from '../types';

// ============================================================================
// 1. THE TEAM PROFILE (Default / Core Identity)
// "This is a TEAM PROJECT created by multiple team members."
// ============================================================================
export const TEAM_PROFILE: User = {
  id: 'usr_team_lived',
  name: 'The Team',
  username: 'the_team',
  email: 'team@lived.app',
  avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80',
  bio: 'A collaborative platform where people share real experiences, practical lessons and ideas to help others learn and grow.',
  location: 'Collaborative Project',
  role: 'Lived — Team Project',
  interests: [
    'Career',
    'Education',
    'Technology',
    'Programming',
    'Freelancing',
    'Personal Growth',
    'Productivity',
  ],
  currentGoal: 'Empowering genuine peer-to-peer learning from lived experiences.',
  followersCount: 1540,
  followingCount: 5,
  experiencesCount: 5,
  helpfulCount: 4210,
  onboardingCompleted: true,
  createdAt: '2026-01-01T00:00:00Z',
};

// Aliased as default for compatibility with existing imports
export const CURRENT_USER: User = TEAM_PROFILE;

// ============================================================================
// 2. TEAM MEMBERS (Clean placeholder member cards ready for actual members)
// ============================================================================
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_01',
    name: 'Team Member 01',
    role: 'Lead Developer & Product Engineering',
    bio: 'Responsible for core web infrastructure, application shell, and component orchestration.',
    initials: '01',
  },
  {
    id: 'tm_02',
    name: 'Team Member 02',
    role: 'UI/UX Design & System Architecture',
    bio: 'Focused on minimal editorial layout, typography scale, responsive viewports and design tokens.',
    initials: '02',
  },
  {
    id: 'tm_03',
    name: 'Team Member 03',
    role: 'Frontend Architecture & API Contracts',
    bio: 'Created clean service abstractions, typed models, and authentication state ready for backend sync.',
    initials: '03',
  },
  {
    id: 'tm_04',
    name: 'Team Member 04',
    role: 'Discovery Engine & Video Learning',
    bio: 'Designed the comprehensive Explorer, YouTube video learning integration, and curated ideas.',
    initials: '04',
  },
  {
    id: 'tm_05',
    name: 'Team Member 05',
    role: 'Quality Assurance & State Polish',
    bio: 'Guaranteed 1-minute simple publishing flow, bookmarking workflows, and cross-browser resilience.',
    initials: '05',
  },
];

// ============================================================================
// 3. CURATED WATCH & LEARN VIDEOS (Public YouTube embeds/links)
// Clearly identified as "From YouTube" / "External Resource"
// ============================================================================
export const CURATED_VIDEOS: ExploreVideo[] = [
  {
    id: 'vid_01',
    title: 'How to Live Before You Die (Stanford Commencement Address)',
    description: 'Connecting the dots, love and loss, and how the awareness of mortality clarifies what truly matters.',
    creator: 'Steve Jobs / Stanford University',
    source: 'YouTube',
    category: 'Motivation',
    duration: '15:04',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    youtubeVideoId: 'UF8uR6Z6KLc',
    youtubeUrl: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    whyWatchThis: 'One of the most honest reflections on failure, resilience, and following genuine curiosity rather than safe expectations.',
    keyTakeaways: [
      'You cannot connect the dots looking forward; you can only connect them looking backwards.',
      'Getting fired was the best thing that could have happened to me: lightness replaced heaviness.',
      'Your time is limited, so don\'t waste it living someone else\'s life.',
    ],
    viewsCount: '42M views',
  },
  {
    id: 'vid_02',
    title: 'How I Manage My Time - 10 Practical Productivity Systems',
    description: 'Evidence-based frameworks for time management, avoiding procrastination, and building consistent output without burnout.',
    creator: 'Ali Abdaal',
    source: 'YouTube',
    category: 'Productivity',
    duration: '18:22',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80',
    youtubeVideoId: 'iONDebHX9qk',
    youtubeUrl: 'https://www.youtube.com/watch?v=iONDebHX9qk',
    whyWatchThis: 'Breaks down actionable calendar and task management rules for students, founders, and knowledge workers.',
    keyTakeaways: [
      'Calendar blocking outperforms open-ended to-do lists by 3x.',
      'The daily highlight rule: choose exactly one non-negotiable accomplishment per day.',
      'Energy management matters more than raw hours spent sitting at a desk.',
    ],
    viewsCount: '3.8M views',
  },
  {
    id: 'vid_03',
    title: 'How to Think Like a Programmer (CS50 Lecture 0)',
    description: 'Computational thinking, problem decomposition, and foundational algorithms explained from absolute zero.',
    creator: 'David J. Malan / Harvard CS50',
    source: 'YouTube',
    category: 'Programming',
    duration: '24:45',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    youtubeVideoId: 'zOjov-2OZ0E',
    youtubeUrl: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
    whyWatchThis: 'Demystifies computer science and programming fundamentals with crystal clarity for beginners.',
    keyTakeaways: [
      'Programming is simply expressing precise problem-solving instructions step by step.',
      'Binary search illustrates logarithmic efficiency: divide and conquer.',
      'Focus on concepts and problem-solving before memorizing language syntax.',
    ],
    viewsCount: '8.4M views',
  },
  {
    id: 'vid_04',
    title: 'How to Talk to Customers & Validate Real Problems',
    description: 'The Mom Test framework: how to ask questions about people\'s real life without biasing their answers.',
    creator: 'Y Combinator Startup School',
    source: 'YouTube',
    category: 'Business',
    duration: '16:10',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    youtubeVideoId: 'MT4TgT002DA',
    youtubeUrl: 'https://www.youtube.com/watch?v=MT4TgT002DA',
    whyWatchThis: 'Essential lesson on avoiding building things nobody wants by asking about past behaviors instead of hypothetical opinions.',
    keyTakeaways: [
      'Never ask: "Would you buy this?" Ask: "How did you solve this problem last week?"',
      'Look for active workarounds: if people aren\'t already trying to solve the problem, it\'s not urgent.',
      'Talk about their specific past life experiences, not future promises.',
    ],
    viewsCount: '1.2M views',
  },
  {
    id: 'vid_05',
    title: 'Getting Your First Freelance Client in 30 Days',
    description: 'Cold outreach, personal portfolio proofs of work, and pricing transparency for first-time freelancers.',
    creator: 'Traversy Media & Freelance Devs',
    source: 'YouTube',
    category: 'Freelancing',
    duration: '21:30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    youtubeVideoId: 'e8d1GkWwL6c',
    youtubeUrl: 'https://www.youtube.com/watch?v=e8d1GkWwL6c',
    whyWatchThis: 'Candid advice on landing paying clients without years of prior reputation or expensive agency tools.',
    keyTakeaways: [
      'Build 2 specific sample projects for the exact industry you are targeting before sending cold pitches.',
      'Focus your pitch on the client\'s revenue or speed, not just your tech stack.',
      'Follow up politely 3 to 5 times; 70% of responses happen on follow-ups.',
    ],
    viewsCount: '950K views',
  },
];

// ============================================================================
// 4. IDEAS WORTH EXPLORING (High-yield conceptual frameworks)
// ============================================================================
export const IDEAS_WORTH_EXPLORING: ExploreIdea[] = [
  {
    id: 'idea_01',
    title: 'How to Build Better Habits',
    summary: 'Make behaviors tiny, obvious, and immediate to remove reliance on fragile willpower.',
    category: 'Personal Growth',
    readTimeMinutes: 4,
    coreInsight: 'You do not rise to the level of your goals; you fall to the level of your systems. Reduce friction for good habits and increase friction for bad ones.',
    actionSteps: [
      'Anchor the new habit to an existing routine (e.g. "After I pour morning coffee, I will write 5 lines").',
      'The 2-Minute Rule: Scale down the initial effort until it is impossible to procrastinate.',
      'Never miss twice: If life interrupts your routine once, treat the second consecutive day as mandatory.',
    ],
  },
  {
    id: 'idea_02',
    title: 'How to Start Freelancing',
    summary: 'Shift from generic skill selling to solving one concrete, painful bottleneck for local or online clients.',
    category: 'Freelancing',
    readTimeMinutes: 5,
    coreInsight: 'Clients do not buy programming languages or design software; they buy speed, saved time, and extra revenue.',
    actionSteps: [
      'Pick one tight niche (e.g. Shopify page speed for independent coffee brands).',
      'Build one public case study demonstrating the before-and-after outcome.',
      'Send 5 personalized video audits weekly highlighting immediate fixes they can implement.',
    ],
  },
  {
    id: 'idea_03',
    title: 'How to Improve Your Communication',
    summary: 'Speak simply, listen without formulating your retort, and state the headline before the background context.',
    category: 'Communication',
    readTimeMinutes: 4,
    coreInsight: 'Clear writing and speaking reflect clear thinking. Remove conversational padding and lead with the bottom line (BLUF).',
    actionSteps: [
      'Use the BLUF technique: Bottom Line Up Front in emails and slack messages.',
      'Summarize what the other person said before offering your counterpoint.',
      'Replace filler phrases ("I think", "kind of") with grounded observations.',
    ],
  },
  {
    id: 'idea_04',
    title: 'How to Manage Your Time',
    summary: 'Protect morning blocks for deep cognitively demanding tasks; bundle reactive meetings into the afternoon.',
    category: 'Productivity',
    readTimeMinutes: 4,
    coreInsight: 'Time cannot be managed without ruthless prioritization. Deciding what NOT to do is the essence of high leverage.',
    actionSteps: [
      'Identify your 1 high-leverage task the night before and place it on your morning calendar.',
      'Turn off non-essential notifications during 90-minute focus blocks.',
      'Perform a weekly retrospective to eliminate recurring low-value commitments.',
    ],
  },
  {
    id: 'idea_05',
    title: 'How to Learn a New Skill',
    summary: 'Deconstruct the skill into sub-components, obtain immediate feedback, and practice under realistic conditions.',
    category: 'Education',
    readTimeMinutes: 5,
    coreInsight: 'Passive consumption (reading, watching tutorials) creates the illusion of competence. Only active retrieval and building build neural pathways.',
    actionSteps: [
      'Identify the critical 20% of sub-skills that produce 80% of real outcomes.',
      'Commit to 20 hours of focused, self-directed practice before switching tutorials.',
      'Teach or write a breakdown of the concept for someone with zero background knowledge.',
    ],
  },
  {
    id: 'idea_06',
    title: 'How to Deal With Failure',
    summary: 'Separate your personal identity from project outcomes. Treat setbacks as diagnostic feedback.',
    category: 'Motivation',
    readTimeMinutes: 4,
    coreInsight: 'Failure is not the opposite of success; it is information about the constraints of reality. A failure without reflection is wasted pain.',
    actionSteps: [
      'Write a post-mortem within 48 hours focusing on controllable inputs vs external luck.',
      'Ask: "What assumption was proven false, and what data do I now possess that others don\'t?"',
      'Re-engage with small, immediate action to prevent psychological paralysis.',
    ],
  },
  {
    id: 'idea_07',
    title: 'How to Build Confidence',
    summary: 'Confidence is not a feeling you conjure up; it is the natural byproduct of keeping small promises to yourself.',
    category: 'Personal Growth',
    readTimeMinutes: 3,
    coreInsight: 'Self-trust is earned through consistent execution over time, especially when no one is watching.',
    actionSteps: [
      'Set and achieve 3 micro-commitments every single day.',
      'Collect a "Proof Folder" of past obstacles you solved and milestones reached.',
      'Adopt physical posture and vocal pacing that convey calm presence.',
    ],
  },
];

// ============================================================================
// 5. INITIAL & FEATURED EXPERIENCES
// Includes the 5 core requested topics:
// - "How I Got My First Freelance Client"
// - "What I Learned After Failing My First Business"
// - "How I Learned Programming From Zero"
// - "My University Experience"
// - "Things I Wish I Knew Before Starting Freelancing"
// ============================================================================
export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp_01',
    title: 'How I Got My First Freelance Client',
    description: 'After 3 months of applying on generic job boards with zero responses, I changed my entire strategy to sending 2-minute Loom video audits.',
    author: {
      id: 'usr_team_lived',
      name: 'The Team',
      username: 'the_team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      role: 'Lived — Team Project',
      bio: 'Curated team case study on client acquisition.',
    },
    category: 'Freelancing',
    tags: ['Freelancing', 'Client Acquisition', 'Cold Outreach', 'Career'],
    contentType: 'story',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    story: {
      content: `In early 2024, I decided to transition into freelance frontend development. I spent weeks polishing my resume, setting up Upwork and Fiverr accounts, and bidding on whatever job postings popped up.

Result: 84 proposals sent, 3 replies, 0 contracts. I was burning through my savings and wondering if I had made a terrible mistake.

### The Breakthrough Shift
I realized that clients on freelance boards receive 50+ identical cover letters within 10 minutes of posting. To win, I needed to show value before asking for money.

Instead of applying to public postings, I searched for local e-commerce stores and small service businesses whose websites had obvious performance issues or broken mobile layouts.

### What Worked: The 2-Minute Video Audit
1. I recorded a quick screen video showing their homepage loading on mobile.
2. I pointed out 2 specific things hurting their conversion rate (e.g. uncompressed 5MB hero banner, checkout button cut off on iPhone SE).
3. I built a quick mock-up showing the fixed version.
4. I sent a 3-sentence email: "Hi [Name], I noticed your mobile site is losing customers because the CTA gets clipped on mobile. Here is a 90-second video explaining the fix. No pressure at all—hope this helps!"

On my 7th email, the founder replied: "Can you fix this for us this Thursday?" That single email turned into an $850 initial contract and a ongoing monthly retainer.`,
      whatILearned: 'Give value upfront without asking for anything. Demonstrating competence visually cuts through noise faster than any resume.',
    },
    lessons: [
      {
        id: 'les_01_1',
        number: 1,
        title: 'Provide immediate visual proof',
        description: 'Showing a client their exact problem solved is 10x more persuasive than promising you have the skills.',
        actionableStep: 'Record a 2-minute loom pointing out 1 high-value improvement before pitching.',
      },
      {
        id: 'les_01_2',
        number: 2,
        title: 'Target clients outside crowded marketplaces',
        description: 'Direct outreach eliminates bidding wars and lets you charge value-based rates.',
        actionableStep: 'Look for businesses with dated websites that are already actively spending money on advertising.',
      },
    ],
    likesCount: 342,
    commentsCount: 45,
    helpfulCount: 289,
    notHelpfulCount: 4,
    isLiked: false,
    isSaved: false,
    userHelpfulVote: null,
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-05T08:00:00Z',
  },
  {
    id: 'exp_02',
    title: 'What I Learned After Failing My First Business',
    description: 'We raised angel capital, spent 8 months perfecting software features in secrecy, and launched to complete silence. Here is what that painful mistake taught us.',
    author: {
      id: 'usr_team_lived',
      name: 'The Team',
      username: 'the_team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      role: 'Lived — Team Project',
      bio: 'Team retrospective on startup validation and lean development.',
    },
    category: 'Business',
    tags: ['Business', 'Startups', 'Failure', 'Validation', 'Lessons'],
    contentType: 'story',
    readTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    story: {
      content: `Our first venture was an inventory tracking tool for independent retail boutiques. We were convinced that existing tools were too ugly, and that beautiful UI would naturally attract thousands of shop owners.

We spent $18,000 and 8 months coding in isolation. We added dark mode, custom dashboards, exports, and automations.

### The Launch Disaster
On launch day, we posted on Product Hunt, Hacker News, and Twitter. We got 1,200 upvotes and plenty of praise from developer friends. But exactly two boutique owners signed up, and both stopped logging in after 4 days.

When we finally visited retail store owners in person, we uncovered the brutal truth: their real bottleneck wasn't ugly software—it was supplier delays and physical barcode scanning hardware compatibility. Our cloud app solved a problem they didn't care about.

### What We Should Have Done
If we had spent 2 weeks shadowing 5 shop owners before writing a single line of code, we would have saved 8 months of our lives and thousands of dollars.`,
      whatILearned: 'Never fall in love with your solution. Fall in love with the customer\'s daily friction.',
    },
    lessons: [
      {
        id: 'les_02_1',
        number: 1,
        title: 'Talk to real users before building anything',
        description: 'No code should be written until you observe potential users trying to solve the problem manually.',
        actionableStep: 'Interview 10 people experiencing the friction before creating a prototype.',
      },
      {
        id: 'les_02_2',
        number: 2,
        title: 'Validation requires committed skin in the game',
        description: 'Polite verbal compliments mean zero. Pre-orders, deposits, or signed letters of intent are real validation.',
        actionableStep: 'Ask for a paid pre-order or formal pilot agreement before full feature build.',
      },
    ],
    likesCount: 512,
    commentsCount: 68,
    helpfulCount: 478,
    notHelpfulCount: 6,
    isLiked: false,
    isSaved: true,
    userHelpfulVote: null,
    createdAt: '2026-10-06T10:15:00Z',
    updatedAt: '2026-10-06T10:15:00Z',
  },
  {
    id: 'exp_03',
    title: 'How I Learned Programming From Zero',
    description: 'I went from a complete non-technical background to building web applications in 9 months. The exact roadmap that avoided tutorial purgatory.',
    author: {
      id: 'usr_team_lived',
      name: 'The Team',
      username: 'the_team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      role: 'Lived — Team Project',
      bio: 'Practical guide to self-taught coding.',
    },
    category: 'Programming',
    tags: ['Programming', 'Technology', 'Self-Taught', 'Education', 'Roadmap'],
    contentType: 'story',
    readTimeMinutes: 7,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    story: {
      content: `For the first 3 months of my coding journey, I fell directly into the "tutorial trap". I watched 60+ hours of video courses, followed every keystroke, and felt like a genius.

Then I opened a blank VS Code editor to build a simple habit tracker and couldn't write 5 lines without getting stuck.

### The Shift to Project-Based Struggle
Everything changed when I switched from following tutorials to building projects with intentional constraints:

1. **HTML & CSS Foundations (Weeks 1-4)**: Built 3 clone pages from scratch using only DevTools inspection.
2. **Vanilla JavaScript (Weeks 5-12)**: Focused on DOM manipulation, API fetching, and array transformations before touching any framework.
3. **TypeScript & React (Weeks 13-24)**: Built one full-featured application and refactored it 3 times.

### The Secret: Reading Errors Carefully
Beginners fear error messages in the console. The breakthrough moment was learning that the compiler is not an enemy—it is a free diagnostic tool telling you the exact line number and variable name that went wrong.`,
      whatILearned: 'You only learn programming when you break things and debug them without a tutorial holding your hand.',
    },
    lessons: [
      {
        id: 'les_03_1',
        number: 1,
        title: 'Break tutorial addiction early',
        description: 'After watching a concept, close the video and implement it from scratch on your own machine.',
        actionableStep: 'Spend 2x more time coding than watching video lectures.',
      },
      {
        id: 'les_03_2',
        number: 2,
        title: 'Master one ecosystem deeply first',
        description: 'Jumping between Python, Rust, and JavaScript creates cognitive overload. Pick one stack and stick to it.',
        actionableStep: 'Build 3 functional portfolio projects in one stack before exploring another language.',
      },
    ],
    likesCount: 680,
    commentsCount: 92,
    helpfulCount: 610,
    notHelpfulCount: 8,
    isLiked: true,
    isSaved: false,
    userHelpfulVote: 'yes',
    createdAt: '2026-10-07T14:00:00Z',
    updatedAt: '2026-10-07T14:00:00Z',
  },
  {
    id: 'exp_04',
    title: 'My University Experience',
    description: 'What high school never prepares you for: managing independence, finding study systems that actually work, and building relationships outside the classroom.',
    author: {
      id: 'usr_team_lived',
      name: 'The Team',
      username: 'the_team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      role: 'Lived — Team Project',
      bio: 'Real student survival insights.',
    },
    category: 'Student Life',
    tags: ['Student Life', 'Education', 'College', 'Personal Growth', 'University'],
    contentType: 'story',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    story: {
      content: `Starting university, I believed that GPA was the sole metric of success. I spent my first two semesters pulling all-nighters in library cubicles, memorizing slides and avoiding social events.

By sophomore year, I was burnt out, isolated, and had zero practical skills or professional connections to show for it.

### The Real Value of College
I realized that textbooks and lecture slides are now accessible online for free to anyone in the world. The true, irreplaceable value of university is:
- Direct access to professors during office hours.
- Collaborating with ambitious peers on side projects.
- Student discounts and conference travel grants.
- Low-stakes environments to experiment and fail.

When I shifted my energy to active group projects, internships, and faculty research, both my grades and my happiness skyrocketed.`,
      whatILearned: 'University is an incubator for relationships and practical initiative, not just a testing factory.',
    },
    lessons: [
      {
        id: 'les_04_1',
        number: 1,
        title: 'Office hours are the ultimate cheat code',
        description: 'Professors write recommendations and offer research roles to the students who show up and ask thoughtful questions.',
        actionableStep: 'Visit at least two professors during office hours every single semester.',
      },
      {
        id: 'les_04_2',
        number: 2,
        title: 'Prioritize sleep over cramming',
        description: 'All-nighters degrade cognitive performance for days. Distributed repetition beats last-minute desperation.',
        actionableStep: 'Review lecture notes for 15 minutes within 24 hours of each class.',
      },
    ],
    likesCount: 290,
    commentsCount: 38,
    helpfulCount: 245,
    notHelpfulCount: 3,
    isLiked: false,
    isSaved: false,
    userHelpfulVote: null,
    createdAt: '2026-10-07T16:30:00Z',
    updatedAt: '2026-10-07T16:30:00Z',
  },
  {
    id: 'exp_05',
    title: 'Things I Wish I Knew Before Starting Freelancing',
    description: 'Taxes, contract disputes, scope creep, and how underpricing your services actually repels serious high-paying clients.',
    author: {
      id: 'usr_team_lived',
      name: 'The Team',
      username: 'the_team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      role: 'Lived — Team Project',
      bio: 'Hard-won lessons from independent consulting.',
    },
    category: 'Freelancing',
    tags: ['Freelancing', 'Contracts', 'Pricing', 'Career', 'Money'],
    contentType: 'story',
    readTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    story: {
      content: `When you start freelancing, you think your only job is doing the craft (writing, designing, coding).

In reality, your craft is only about 40% of the job. The remaining 60% is sales, expectation management, contract writing, invoicing, and tax accounting.

### 1. Scope Creep Will Kill Your Profitability
In my early contracts, I agreed to vague milestones like "Build the web app". Clients naturally requested "one more tweak" 30 times. Now, every single deliverable has written boundaries, and extra requests are billed at a clear change-order rate.

### 2. Never Work Without a 50% Upfront Deposit
Legitimate clients who respect your expertise never hesitate to pay a 50% deposit before kickoff. Clients who refuse deposits are almost always the ones who dispute the invoice at the finish line.

### 3. Set Aside 30% for Taxes Immediately
Do not leave taxes until year-end. Every dollar that lands in your business account should immediately have 30% moved to a dedicated tax savings account.`,
      whatILearned: 'Clear contracts preserve relationships. Boundaries make clients respect your professional standards.',
    },
    lessons: [
      {
        id: 'les_05_1',
        number: 1,
        title: 'Always collect 50% deposit upfront',
        description: 'Deposits ensure serious client commitment and protect your cash flow.',
        actionableStep: 'Never start work or deliver code without milestone clearance.',
      },
      {
        id: 'les_05_2',
        number: 2,
        title: 'Document all changes in writing',
        description: 'Scope creep happens when boundaries are undefined. Keep a clear change-order log.',
        actionableStep: 'Reply to out-of-scope requests: "Happy to add this! Let me send over a brief addendum with the estimated hours."',
      },
    ],
    likesCount: 420,
    commentsCount: 52,
    helpfulCount: 388,
    notHelpfulCount: 5,
    isLiked: false,
    isSaved: true,
    userHelpfulVote: null,
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-08T09:00:00Z',
  },
];

// ============================================================================
// 6. INITIAL NOTIFICATIONS
// ============================================================================
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    userId: 'usr_team_lived',
    actor: {
      id: 'usr_peer_01',
      name: 'Community Learner',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    type: 'helpful',
    targetId: 'exp_01',
    targetTitle: 'How I Got My First Freelance Client',
    message: 'marked your team experience as helpful! "This gave me the confidence to send my first video pitch."',
    isRead: false,
    createdAt: '2026-10-08T14:15:00Z',
  },
  {
    id: 'notif_02',
    userId: 'usr_team_lived',
    actor: {
      id: 'usr_peer_02',
      name: 'Aspiring Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    type: 'comment',
    targetId: 'exp_03',
    targetTitle: 'How I Learned Programming From Zero',
    message: 'commented: "Which CSS project helped you understand flexbox best?"',
    isRead: false,
    createdAt: '2026-10-08T11:30:00Z',
  },
  {
    id: 'notif_03',
    userId: 'usr_team_lived',
    actor: {
      id: 'usr_peer_03',
      name: 'Student Fellow',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    },
    type: 'follow',
    targetId: 'usr_team_lived',
    message: 'started following The Team project updates.',
    isRead: true,
    createdAt: '2026-10-07T16:20:00Z',
  },
];
