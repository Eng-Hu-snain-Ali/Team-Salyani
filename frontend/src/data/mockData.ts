import type { Experience, Notification, User } from '../types';

export const CURRENT_USER: User = {
  id: 'usr_me_01',
  name: 'Alex Chen',
  username: 'alexchen_dev',
  email: 'alex.chen@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Software engineer & curious learner. Sharing what university never taught me about career transitions and saving money.',
  location: 'San Francisco, CA',
  role: 'Frontend Engineer',
  interests: ['Career', 'Technology', 'Money', 'Personal Growth'],
  currentGoal: 'Land my first senior engineering role & invest consistently without burnout.',
  followersCount: 342,
  followingCount: 189,
  experiencesCount: 4,
  helpfulCount: 890,
  onboardingCompleted: true,
  createdAt: '2026-01-15T08:00:00Z',
};

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp_01',
    title: 'How I Lost $8,000 on My First E-Commerce Venture (And What Actually Saved My Career)',
    description: 'I thought buying bulk inventory was how real entrepreneurs start. Here is the painful mistake that wiped my savings, and how pre-validation changed everything.',
    author: {
      id: 'usr_02',
      name: 'Tariq Rehman',
      username: 'tariq_builds',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'E-Com Founder & Angel Investor',
      bio: 'Built two 7-figure digital retail brands after losing my life savings at 22.'
    },
    category: 'Business',
    tags: ['E-Commerce', 'Bootstrapping', 'Validation', 'Financial Mistakes'],
    contentType: 'story',
    readTimeMinutes: 7,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    story: {
      whereIStarted: 'In 2022, right out of college, I wanted financial independence. I saved $8,000 working double shifts at a café. I was obsessed with "getting rich before 25".',
      theProblem: 'I found what I assumed was a revolutionary ergonomic laptop stand on Alibaba. Without talking to a single customer, I wired my entire $8,000 life savings to a manufacturer for 1,200 units.',
      whatITried: 'I rented a storage unit, built a Shopify store with stock photos, and launched Facebook ads. I expected sales to roll in within 48 hours.',
      whatFailed: 'Zero orders the first week. By week four, after spending an additional $1,200 on credit card ads, I had sold exactly 9 units—6 of which were to supportive relatives. The boxes sat in storage gathering dust while monthly fees ate my remaining cash.',
      whatWorked: 'Desperate to recover, I stopped hiding behind Facebook Ads Manager. I took 10 units in my backpack to local co-working spaces and universities. I asked freelancers: "Try this stand for one hour for free, then tell me why you wouldn\'t buy it." I discovered the stand was 200g too heavy for commuters. Once I pivoted to custom ultra-light travel stands with pre-orders, the concept finally took off.',
      whatILearned: 'Product validation must ALWAYS precede production. Never confuse an idea you love with customer demand that already exists.',
      whatIWouldDoDifferently: 'I would set up a simple landing page with a "Pre-order with $5 deposit" button and run $50 worth of traffic. If 10 strangers won\'t put down $5, do not produce 1,200 units.'
    },
    lessons: [
      {
        id: 'les_01_1',
        number: 1,
        title: 'Validate demand before touching inventory',
        description: 'Never manufacture or buy bulk products based on intuition. Secure 10 committed customers with cash or deposits first.',
        actionableStep: 'Create a 1-page pre-order form before spending more than $100.'
      },
      {
        id: 'les_01_2',
        number: 2,
        title: 'Face-to-face feedback beats algorithmic ad spend',
        description: 'If strangers won\'t buy from you in person after trying your product, paying Mark Zuckerberg for ads won\'t fix the flaw.',
        actionableStep: 'Interview 10 target users in person before scaling advertising.'
      },
      {
        id: 'les_01_3',
        number: 3,
        title: 'Protect your downside capital',
        description: 'Never risk 100% of your available liquidity on a single unproven hypothesis.',
        actionableStep: 'Cap your early test budget at a maximum of 15% of your total savings.'
      }
    ],
    likesCount: 524,
    commentsCount: 68,
    helpfulCount: 489,
    notHelpfulCount: 12,
    isLiked: false,
    isSaved: true,
    userHelpfulVote: null,
    createdAt: '2026-09-28T14:32:00Z',
    updatedAt: '2026-09-28T14:32:00Z'
  },
  {
    id: 'exp_02',
    title: 'From Self-Taught to $110k Developer Without a CS Degree in 14 Months',
    description: 'A realistic, no-hype breakdown of what tutorials never tell you: navigating tutorial hell, building production proof, and cold outreach that actually converts.',
    author: {
      id: 'usr_03',
      name: 'Maya Lin',
      username: 'mayacodes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Staff Frontend Engineer at Fintech',
      bio: 'Former hospitality manager turned software engineer. Mentoring first-gen techies.'
    },
    category: 'Technology',
    tags: ['WebDev', 'Career Transition', 'React', 'Self Taught'],
    contentType: 'video',
    readTimeMinutes: 12,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      durationSeconds: 745
    },
    story: {
      whereIStarted: 'I worked 50-hour weeks managing a restaurant. At 25, I was burned out, living paycheck to paycheck, with zero coding background.',
      theProblem: 'I spent 4 months watching Udemy courses on 2x speed, copying the instructors line-by-line. The moment I opened a blank VS Code editor, my mind went completely blank. I had fallen into classic "Tutorial Hell".',
      whatITried: 'I tried building clone apps (Netflix clone, Spotify clone). But recruiters immediately recognized generic clones and rejected my applications automatically.',
      whatFailed: 'Submitting 300 generic applications through LinkedIn "Easy Apply" with a clone portfolio yielded zero interviews and shattered my confidence.',
      whatWorked: 'I stopped building clones. I walked into my friend\'s local bakery and built them an interactive order management and inventory dashboard that they used daily. Now I had real user metrics, real bug fixes, and a production URL to show in interviews.',
      whatILearned: 'Hiring managers don\'t care how many tutorials you completed. They care if you can take an ambiguous real-world requirement and deliver working software.',
      whatIWouldDoDifferently: 'I would stop doing beginner tutorials after month 2 and contribute directly to open source or build one single project used by a real human being.'
    },
    lessons: [
      {
        id: 'les_02_1',
        number: 1,
        title: 'Escape tutorial hell through original pain',
        description: 'You only truly learn programming when you stare at a red console error you haven\'t seen before and debug it yourself.',
        actionableStep: 'Build a project that does not have an accompanying YouTube video or course.'
      },
      {
        id: 'les_02_2',
        number: 2,
        title: 'One real user beats ten fake clones',
        description: 'A simple CRUD tool with 5 active weekly users is 100x more impressive to hiring directors than a cloned social feed.',
        actionableStep: 'Solve a real problem for a friend, charity, or local business.'
      },
      {
        id: 'les_02_3',
        number: 3,
        title: 'Direct technical outreach beats cold apply',
        description: 'Send a 2-minute Loom video walking through an engineering suggestion for the company instead of sending a dry PDF resume.',
        actionableStep: 'Record a Loom audit for 5 target startups weekly.'
      }
    ],
    likesCount: 892,
    commentsCount: 142,
    helpfulCount: 840,
    notHelpfulCount: 19,
    isLiked: true,
    isSaved: true,
    userHelpfulVote: 'yes',
    createdAt: '2026-10-02T10:15:00Z',
    updatedAt: '2026-10-02T10:15:00Z'
  },
  {
    id: 'exp_03',
    title: 'How I Cleared My Medical Licensing Exam While Working 30-Hour Hospital Shifts',
    description: 'My high-yield cognitive framework: why passive re-reading fails, how active recall transformed my retention, and managing chronic sleep debt.',
    author: {
      id: 'usr_04',
      name: 'Dr. Zainab Qureshi',
      username: 'dr_zainab',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'Internal Medicine Resident',
      bio: 'Medical educator focusing on neuroplasticity, memory protocols, and evidence-based learning.'
    },
    category: 'Education',
    tags: ['Exam Prep', 'Anki', 'Active Recall', 'Productivity'],
    contentType: 'guide',
    readTimeMinutes: 9,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    story: {
      whereIStarted: 'Preparing for Step 2 while managing night shifts in the emergency department. I had roughly 2.5 hours of usable daily energy outside the hospital.',
      theProblem: 'I highlighted textbooks and re-read medical notes. On practice exams, my score plateaued at the 45th percentile. I felt like information was leaking out of my brain like a sieve.',
      whatITried: 'Drinking 4 cups of coffee, sleeping 4 hours, and grinding 1,000 flashcards mindlessly in bed.',
      whatFailed: 'Severe memory fatigue. I couldn\'t recall differential diagnoses under timed pressure because my flashcards tested passive recognition, not clinical application.',
      whatWorked: 'I switched to "Desirable Difficulty" active retrieval. Instead of flipping cards, I forced myself to write the diagnostic pathway on a blank whiteboard before looking at the answer. My retention skyrocketed to 92%.',
      whatILearned: 'If studying feels comfortable and easy, your brain is not forming durable neural pathways. Effective learning feels slightly difficult and mentally exhausting.',
      whatIWouldDoDifferently: 'I would prioritize 7 hours of non-negotiable sleep over an extra 2 hours of exhausted late-night reading.'
    },
    lessons: [
      {
        id: 'les_03_1',
        number: 1,
        title: 'Recognition is not retention',
        description: 'Re-reading highlighters tricks your brain into thinking you understand when you merely recognize familiar shapes.',
        actionableStep: 'Close your notes and teach the concept aloud to an empty chair.'
      },
      {
        id: 'les_03_2',
        number: 2,
        title: 'Sleep is the consolidation engine',
        description: 'Memory consolidation happens during slow-wave and REM sleep. Studying on 4 hours sleep literally flushes information down the drain.',
        actionableStep: 'Protect a mandatory 7-hour sleep window as an academic duty.'
      }
    ],
    likesCount: 673,
    commentsCount: 94,
    helpfulCount: 615,
    notHelpfulCount: 8,
    isLiked: false,
    isSaved: false,
    userHelpfulVote: null,
    createdAt: '2026-10-04T16:40:00Z',
    updatedAt: '2026-10-04T16:40:00Z'
  },
  {
    id: 'exp_04',
    title: 'Moving to Berlin Alone at 21 with €1,500: The Bureaucracy, Loneliness & Housing Survival Guide',
    description: 'An honest breakdown of moving abroad: dealing with the Anmeldung, escaping shared-apartment scams, and making lifelong friends when you speak zero German.',
    author: {
      id: 'usr_05',
      name: 'Julian Vance',
      username: 'julian_vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'UX Designer & Nomad',
      bio: 'Lived across 5 countries. Writing candid guides on relocation reality.'
    },
    category: 'Travel',
    tags: ['Moving Abroad', 'Berlin', 'Solo Travel', 'Culture Shock'],
    contentType: 'pdf',
    readTimeMinutes: 10,
    coverImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop&q=80',
    media: {
      type: 'pdf',
      url: '/assets/berlin-relocation-survival-kit.pdf',
      fileName: 'berlin-relocation-survival-kit.pdf',
      fileSizeBytes: 2450000
    },
    story: {
      whereIStarted: 'Left London with one suitcase, €1,500 in my checking account, and an Airbnb booked for 10 days.',
      theProblem: 'In Berlin, you cannot rent an apartment without an Anmeldung (residence registration), and you cannot get an Anmeldung without having an apartment. It is a notorious bureaucratic catch-22.',
      whatITried: 'Responding to random listings on Facebook groups. Almost lost €800 to a scammer asking for deposit via Western Union.',
      whatFailed: 'Staying isolated in my Airbnb and stressing over paperwork while watching savings dwindle to €400.',
      whatWorked: 'I joined a local bouldering gym and a weekly language exchange meetup. Within 5 days of meeting actual expats in person, a roommate told me their flatmate was moving to Vienna for 6 months and offered a legitimate sublet with registration.',
      whatILearned: 'When moving abroad, physical human networks solve bureaucratic roadblocks 10x faster than digital listings.',
      whatIWouldDoDifferently: 'I would save at least 3 months of emergency expenses (€3,500) instead of €1,500.'
    },
    lessons: [
      {
        id: 'les_04_1',
        number: 1,
        title: 'Never transfer deposits before seeing the keys',
        description: 'Rental scams target desperate foreigners. Never send wire transfers or crypto for apartments you have not inspected physically.',
        actionableStep: 'Always request official rental contracts with passport verification.'
      },
      {
        id: 'les_04_2',
        number: 2,
        title: 'Join offline interest communities immediately',
        description: 'Loneliness is the #1 reason young expats give up and return home within 90 days. Build a weekly hobby circle in week one.',
        actionableStep: 'Attend a run club, gym, or hobby meetup within 72 hours of landing.'
      }
    ],
    likesCount: 412,
    commentsCount: 51,
    helpfulCount: 388,
    notHelpfulCount: 14,
    isLiked: false,
    isSaved: false,
    userHelpfulVote: null,
    createdAt: '2026-10-05T09:20:00Z',
    updatedAt: '2026-10-05T09:20:00Z'
  },
  {
    id: 'exp_05',
    title: 'The Silent Creep: How Lifestyle Inflation Trapped Me in a Toxic Job for 3 Years',
    description: 'When my salary jumped from $45k to $95k, I thought I was rich. Here is how upgrading my car, apartment, and habits trapped me until I rebuilt my emergency runway.',
    author: {
      id: 'usr_06',
      name: 'Farhan Siddiqui',
      username: 'farhan_wealth',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'Financial Coach',
      bio: 'Former corporate analyst helping early-career professionals escape the golden handcuffs.'
    },
    category: 'Money',
    tags: ['Personal Finance', 'Lifestyle Inflation', 'F.I.R.E.', 'Budgeting'],
    contentType: 'story',
    readTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    story: {
      whereIStarted: 'Got promoted to Senior Strategy Associate at 24. My take-home pay more than doubled overnight.',
      theProblem: 'Within 6 months, every dollar was committed: a luxury 1-bedroom apartment, dining at high-end spots, and a leased BMW. My savings rate was 0%.',
      whatITried: 'Working even longer hours to get another bonus so I could start investing.',
      whatFailed: 'My manager became openly hostile. Because I had exactly 2 weeks of savings in my bank account, I was terrified of quitting. The golden handcuffs were entirely my own doing.',
      whatWorked: 'I instituted the "Base-Line Protocol": I capped my living baseline at my old $45k standard. I automatically diverted 50% of each paycheck into a separate index fund account before it hit checking.',
      whatILearned: 'Wealth isn\'t what you spend; wealth is the options and peace of mind your unspent capital buys you.',
      whatIWouldDoDifferently: 'I would freeze my living expenses for 12 full months after every salary increase.'
    },
    lessons: [
      {
        id: 'les_05_1',
        number: 1,
        title: 'Lifestyle inflation is an invisible trap',
        description: 'Upgrading your spending alongside every raise keeps your freedom score at zero regardless of your compensation.',
        actionableStep: 'Automate 50% of every raise directly into investments on day one.'
      },
      {
        id: 'les_05_2',
        number: 2,
        title: 'An emergency fund is your "Dignity Fund"',
        description: 'Having 6 months of living expenses gives you the power to say no to abusive work environments.',
        actionableStep: 'Build a 3-month survival runway before upgrading any lifestyle item.'
      }
    ],
    likesCount: 915,
    commentsCount: 118,
    helpfulCount: 882,
    notHelpfulCount: 11,
    isLiked: true,
    isSaved: true,
    userHelpfulVote: 'yes',
    createdAt: '2026-10-06T11:00:00Z',
    updatedAt: '2026-10-06T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    userId: 'usr_me_01',
    actor: {
      id: 'usr_02',
      name: 'Tariq Rehman',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    type: 'helpful',
    targetId: 'exp_01',
    targetTitle: 'How I Built My First Micro-SaaS',
    message: 'marked your experience as helpful! "This saved me 2 months of wasted work."',
    isRead: false,
    createdAt: '2026-10-08T09:15:00Z'
  },
  {
    id: 'notif_02',
    userId: 'usr_me_01',
    actor: {
      id: 'usr_03',
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    type: 'comment',
    targetId: 'exp_02',
    targetTitle: 'From Self-Taught to $110k Developer',
    message: 'commented: "How did you manage burnout during month 6?"',
    isRead: false,
    createdAt: '2026-10-08T07:30:00Z'
  },
  {
    id: 'notif_03',
    userId: 'usr_me_01',
    actor: {
      id: 'usr_04',
      name: 'Dr. Zainab Qureshi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    type: 'follow',
    targetId: 'usr_me_01',
    message: 'started following your journey in Technology & Career.',
    isRead: true,
    createdAt: '2026-10-07T14:20:00Z'
  }
];
