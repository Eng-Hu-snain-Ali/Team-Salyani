export interface ServiceItem {
  id: string;
  name: string;
  price: number; // in PKR
  duration: string;
  category: 'electrician' | 'plumber' | 'ac' | 'bike' | 'car' | 'carpenter';
  description: string;
  icon: string;
}

export interface UstadProfile {
  id: string;
  name: string;
  phone: string;
  cnic: string;
  skill: 'electrician' | 'plumber' | 'ac' | 'bike' | 'car' | 'carpenter';
  experienceYears: number;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  earningsPKR: number;
  isVerified: boolean;
  isAvailable: boolean;
  avatar: string;
  locationName: string;
  lat: number;
  lng: number;
  cnicFrontImg?: string;
  certificateImg?: string;
  skillsBadges: string[];
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  serviceType: 'electrician' | 'plumber' | 'ac' | 'bike' | 'car' | 'carpenter';
  serviceItems: string[];
  totalPrice: number;
  platformCommission: number; // 10%
  ustadEarning: number; // 90%
  ustadId?: string;
  ustadName?: string;
  ustadPhone?: string;
  status: 'pending' | 'accepted' | 'on_the_way' | 'working' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'jazzcash' | 'easypaisa';
  paymentStatus: 'pending' | 'paid';
  problemDescription: string;
  problemImageUrl?: string;
  urgency: 'immediate' | 'scheduled';
  scheduledTime?: string;
  createdAt: string;
  rating?: number;
  reviewComment?: string;
}

export interface FaisalabadLocation {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

export const FAISALABAD_LOCATIONS: FaisalabadLocation[] = [
  { id: 'loc-1', name: 'D-Ground Commercial Market', area: 'Peoples Colony #1', lat: 31.4118, lng: 73.0978 },
  { id: 'loc-2', name: 'Kohinoor City & Jaranwala Rd', area: 'Kohinoor', lat: 31.4245, lng: 73.1123 },
  { id: 'loc-3', name: 'Madina Town Main Boulevard', area: 'Madina Town', lat: 31.4367, lng: 73.1098 },
  { id: 'loc-4', name: 'Susan Road Plaza Market', area: 'Madina Town East', lat: 31.4312, lng: 73.1189 },
  { id: 'loc-5', name: 'Ghulam Muhammad Abad Sector B', area: 'GM Abad', lat: 31.4023, lng: 73.0456 },
  { id: 'loc-6', name: 'Gulberg Colony & Canal Rd', area: 'Gulberg', lat: 31.4421, lng: 73.0845 },
  { id: 'loc-7', name: 'Samanabad Market Area', area: 'Samanabad', lat: 31.3912, lng: 73.0789 },
  { id: 'loc-8', name: 'Ghanta Ghar (Eight Bazaars)', area: 'City Center', lat: 31.4187, lng: 73.0791 },
];

export const SERVICE_CATEGORIES = [
  { id: 'electrician', name: 'Electrician', urdu: 'الیکٹریشن', icon: 'Zap', color: 'from-amber-500 to-orange-500', popular: true },
  { id: 'plumber', name: 'Plumber', urdu: 'پلمبر', icon: 'Wrench', color: 'from-teal-500 to-emerald-600', popular: true },
  { id: 'ac', name: 'AC Technician', urdu: 'اے سی ٹیکنیشن', icon: 'Snowflake', color: 'from-emerald-400 to-teal-600', popular: true },
  { id: 'bike', name: 'Bike Mechanic', urdu: 'موٹر سائیکل مکینک', icon: 'Bike', color: 'from-emerald-500 to-teal-500', popular: true },
  { id: 'car', name: 'Car Mechanic', urdu: 'گاڑی کا مکینک', icon: 'Car', color: 'from-rose-500 to-orange-600', popular: false },
  { id: 'carpenter', name: 'Carpenter', urdu: 'بڑھئی / کارپینٹر', icon: 'Hammer', color: 'from-amber-600 to-yellow-600', popular: false },
] as const;

export const FIXED_RATE_CARD: ServiceItem[] = [
  // Electrician
  { id: 'el-1', category: 'electrician', name: 'Switch Board Repair & Wiring Check', price: 300, duration: '20-30 min', icon: 'ToggleLeft', description: 'Repairing broken switches, buttons, socket test and replacement' },
  { id: 'el-2', category: 'electrician', name: 'Ceiling Fan Repair & Capacitor Change', price: 450, duration: '30-40 min', icon: 'Wind', description: 'Capacitor replacement, speed regulator fix, bearing sound inspection' },
  { id: 'el-3', category: 'electrician', name: 'Short Circuit & Fuse Fault Tracing', price: 650, duration: '45-60 min', icon: 'AlertTriangle', description: 'High-precision multimeter testing for phase neutral faults' },
  { id: 'el-4', category: 'electrician', name: 'UPS & Inverter Battery Maintenance', price: 800, duration: '40 min', icon: 'BatteryCharging', description: 'Terminal cleaning, acid level inspection and breaker testing' },
  { id: 'el-5', category: 'electrician', name: 'Main DB Box & Breaker Installation', price: 750, duration: '45 min', icon: 'Shield', description: 'Sub breaker replacement, proper grounding and safety checks' },

  // Plumber
  { id: 'pl-1', category: 'plumber', name: 'Water Tap & Mixer Leakage Repair', price: 350, duration: '20-30 min', icon: 'Droplets', description: 'Washer replacement, spindle repair, kitchen or bathroom mixer fix' },
  { id: 'pl-2', category: 'plumber', name: 'Water Motor Repair & Fitting', price: 850, duration: '45-60 min', icon: 'Activity', description: 'Impeller adjustment, capacitor change, pipe seal & pressure check' },
  { id: 'pl-3', category: 'plumber', name: 'Drainage Pipe Blockage Cleaning', price: 600, duration: '30-45 min', icon: 'Layers', description: 'Sink, shower or kitchen waste pipe clearing with steel snake wire' },
  { id: 'pl-4', category: 'plumber', name: 'Instant Geyser Descaling & Servicing', price: 950, duration: '60 min', icon: 'Flame', description: 'Gas burner cleaning, solenoid valve test and scale flush' },
  { id: 'pl-5', category: 'plumber', name: 'Commode / Flush Tank Mechanism Fix', price: 500, duration: '35 min', icon: 'RotateCcw', description: 'Float valve, syphon fitting and leak prevention' },

  // AC Technician
  { id: 'ac-1', category: 'ac', name: 'AC Master Chemical Foam Wash', price: 1500, duration: '50-60 min', icon: 'Sparkles', description: 'Indoor blower + outdoor coil pressure cleaning with antibacterial foam' },
  { id: 'ac-2', category: 'ac', name: 'Gas Refill & Leak Testing (R410 / R32)', price: 2800, duration: '45 min', icon: 'Gauge', description: 'Nitrogen leak test, valve flare nut tightening, pure refrigerant top-up' },
  { id: 'ac-3', category: 'ac', name: 'Inverter PCB Card Diagnosis & Fix', price: 2200, duration: '60-90 min', icon: 'Cpu', description: 'Fault code analysis, IPM chip, sensor check and circuit trace' },
  { id: 'ac-4', category: 'ac', name: 'Standard Filter & Indoor Service', price: 600, duration: '25 min', icon: 'Filter', description: 'Water tray clean, filter mesh wash and grill sanitation' },
  { id: 'ac-5', category: 'ac', name: 'Split AC Dismantle & Re-installation', price: 2000, duration: '90 min', icon: 'Minimize2', description: 'Copper piping bracket mounting and vacuuming' },

  // Bike Mechanic
  { id: 'bk-1', category: 'bike', name: 'Motorcycle Tuning & Engine Oil Service', price: 500, duration: '35 min', icon: 'Wrench', description: 'Valve tappet clearance, spark plug clean, air filter and chain grease' },
  { id: 'bk-2', category: 'bike', name: 'Carburetor Ultrasonic Clean & Tune', price: 350, duration: '30 min', icon: 'Sliders', description: 'Slow jet / main jet clearance for optimal petrol average' },
  { id: 'bk-3', category: 'bike', name: 'Brake Shoes Change & Cable Lubrication', price: 300, duration: '25 min', icon: 'Disc', description: 'Front/rear brake pads adjustment, drum cleaning for safety' },
  { id: 'bk-4', category: 'bike', name: 'On-Spot Puncture & Tube Replacement', price: 200, duration: '20 min', icon: 'Circle', description: 'Emergency roadside puncture patch or brand new tube install' },

  // Car Mechanic
  { id: 'cr-1', category: 'car', name: 'Computer OBD-II Diagnostic Scan', price: 1200, duration: '30 min', icon: 'Terminal', description: 'Check engine light readout, sensor diagnostics and clearing codes' },
  { id: 'cr-2', category: 'car', name: 'Emergency Jump Start & Battery Check', price: 600, duration: '20 min', icon: 'Zap', description: 'High-cranking heavy booster jump start and alternator voltage verify' },
  { id: 'cr-3', category: 'car', name: 'Front Brake Pads Replacement', price: 1000, duration: '45 min', icon: 'ShieldAlert', description: 'Rotor inspection, caliper slide pin greasing, pad install' },
  { id: 'cr-4', category: 'car', name: 'Radiator Leak Inspection & Coolant Flush', price: 850, duration: '40 min', icon: 'Thermometer', description: 'Cap pressure test, hose inspection, rust flush and refill' },

  // Carpenter
  { id: 'cp-1', category: 'carpenter', name: 'Main Door Lock & Handle Installation', price: 450, duration: '35 min', icon: 'Key', description: 'Mortise lock chisel fitting, brass handle alignment and latch test' },
  { id: 'cp-2', category: 'carpenter', name: 'Drawer Channel & Hydraulic Hinge Fix', price: 400, duration: '30 min', icon: 'Grid', description: 'Smooth soft-close channel replacement and cabinet door leveling' },
  { id: 'cp-3', category: 'carpenter', name: 'Bed & Wardrobe Assembly / Disassembly', price: 1200, duration: '60-80 min', icon: 'Package', description: 'King size bed frame tightening, wardrobe dismantle or relocation' },
];

export const INITIAL_USTADS: UstadProfile[] = [
  {
    id: 'ustad-101',
    name: 'Ustad Tariq Mehmood',
    phone: '0300-8654321',
    cnic: '33100-8451234-7',
    skill: 'electrician',
    experienceYears: 12,
    rating: 4.9,
    totalReviews: 184,
    totalJobs: 240,
    earningsPKR: 84500,
    isVerified: true,
    isAvailable: true,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    locationName: 'D-Ground, Peoples Colony',
    lat: 31.4135,
    lng: 73.0991,
    skillsBadges: ['UPS Expert', 'Breaker Pro', 'Wiring Master'],
  },
  {
    id: 'ustad-102',
    name: 'Muhammad Asif (Chacha Plumber)',
    phone: '0302-7651234',
    cnic: '33101-2345678-3',
    skill: 'plumber',
    experienceYears: 15,
    rating: 4.8,
    totalReviews: 142,
    totalJobs: 195,
    earningsPKR: 68200,
    isVerified: true,
    isAvailable: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    locationName: 'Kohinoor City, Faisalabad',
    lat: 31.4230,
    lng: 73.1110,
    skillsBadges: ['Leak Specialist', 'Motor Fitting', 'Sanitary Pro'],
  },
  {
    id: 'ustad-103',
    name: 'Engr. Kamran Raza',
    phone: '0313-9876543',
    cnic: '33102-9876543-1',
    skill: 'ac',
    experienceYears: 8,
    rating: 5.0,
    totalReviews: 97,
    totalJobs: 130,
    earningsPKR: 98000,
    isVerified: true,
    isAvailable: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    locationName: 'Madina Town, Susan Road',
    lat: 31.4350,
    lng: 73.1115,
    skillsBadges: ['Inverter PCB Certified', 'Chemical Foam Pro', 'R32 Expert'],
  },
  {
    id: 'ustad-104',
    name: 'Ustad Naveed Butt',
    phone: '0304-5544332',
    cnic: '33100-1122334-5',
    skill: 'bike',
    experienceYears: 9,
    rating: 4.7,
    totalReviews: 88,
    totalJobs: 110,
    earningsPKR: 42300,
    isVerified: true,
    isAvailable: true,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    locationName: 'Ghanta Ghar / Rail Bazaar',
    lat: 31.4170,
    lng: 73.0810,
    skillsBadges: ['CD70 & 125 Tuning', 'Roadside Quick Fix', 'Carburetor Master'],
  },
  {
    id: 'ustad-105',
    name: 'Farhan Ali (Auto Care)',
    phone: '0321-7788990',
    cnic: '33102-6655443-9',
    skill: 'car',
    experienceYears: 11,
    rating: 4.9,
    totalReviews: 64,
    totalJobs: 82,
    earningsPKR: 71000,
    isVerified: true,
    isAvailable: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    locationName: 'Canal Road, Faisalabad',
    lat: 31.4410,
    lng: 73.0880,
    skillsBadges: ['OBD-II Scanner', 'Hybrid Ready', 'Brake Systems'],
  },
  {
    id: 'ustad-106',
    name: 'Rashid Minhas',
    phone: '0345-6677881',
    cnic: '33100-9988776-3',
    skill: 'carpenter',
    experienceYears: 14,
    rating: 4.8,
    totalReviews: 76,
    totalJobs: 94,
    earningsPKR: 54000,
    isVerified: true,
    isAvailable: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    locationName: 'Gulberg Colony',
    lat: 31.4390,
    lng: 73.0815,
    skillsBadges: ['Lock Fitting', 'Custom Woodwork', 'Wardrobe Pro'],
  },
  {
    id: 'ustad-107',
    name: 'Zubair Shahzad (Applicant)',
    phone: '0308-4455667',
    cnic: '33101-5544332-1',
    skill: 'electrician',
    experienceYears: 4,
    rating: 0,
    totalReviews: 0,
    totalJobs: 0,
    earningsPKR: 0,
    isVerified: false,
    isAvailable: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    locationName: 'Ghulam Muhammad Abad',
    lat: 31.4050,
    lng: 73.0480,
    skillsBadges: ['Basic Wiring', 'Fan Repair'],
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-7891',
    userId: 'usr-1',
    userName: 'Zia-ur-Rehman',
    userPhone: '0300-1234567',
    userAddress: 'House 14-B, Street 3, Peoples Colony #1, Faisalabad',
    serviceType: 'electrician',
    serviceItems: ['Switch Board Repair & Wiring Check', 'Ceiling Fan Repair & Capacitor Change'],
    totalPrice: 750,
    platformCommission: 75,
    ustadEarning: 675,
    ustadId: 'ustad-101',
    ustadName: 'Ustad Tariq Mehmood',
    ustadPhone: '0300-8654321',
    status: 'completed',
    paymentMethod: 'jazzcash',
    paymentStatus: 'paid',
    problemDescription: 'Main lounge board sparks when AC button is turned on.',
    urgency: 'immediate',
    createdAt: 'Today, 11:30 AM',
    rating: 5,
    reviewComment: 'MashaAllah bohot behtareen kaam kiya Tariq bhai ne. On time pohanche!',
  },
  {
    id: 'BK-7892',
    userId: 'usr-2',
    userName: 'Ayesha Chaudhry',
    userPhone: '0321-9876543',
    userAddress: 'Flat 402, Kohinoor Heights, Jaranwala Road, Faisalabad',
    serviceType: 'ac',
    serviceItems: ['AC Master Chemical Foam Wash'],
    totalPrice: 1500,
    platformCommission: 150,
    ustadEarning: 1350,
    ustadId: 'ustad-103',
    ustadName: 'Engr. Kamran Raza',
    ustadPhone: '0313-9876543',
    status: 'working',
    paymentMethod: 'easypaisa',
    paymentStatus: 'pending',
    problemDescription: 'Split AC not cooling properly and blowing foul odor.',
    urgency: 'immediate',
    createdAt: 'Today, 02:15 PM',
  },
  {
    id: 'BK-7893',
    userId: 'usr-3',
    userName: 'Dr. Hamza Malik',
    userPhone: '0333-5566778',
    userAddress: 'Opposite Susan Road Commercial Hub, Madina Town, Faisalabad',
    serviceType: 'plumber',
    serviceItems: ['Water Motor Repair & Fitting'],
    totalPrice: 850,
    platformCommission: 85,
    ustadEarning: 765,
    ustadId: 'ustad-102',
    ustadName: 'Muhammad Asif (Chacha Plumber)',
    ustadPhone: '0302-7651234',
    status: 'on_the_way',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    problemDescription: 'Water motor making loud grinding noise and no water coming up.',
    urgency: 'immediate',
    createdAt: 'Today, 03:45 PM',
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    bookingId: 'BK-7891',
    ustadId: 'ustad-101',
    customerName: 'Zia-ur-Rehman',
    rating: 5,
    date: 'Today',
    service: 'Electrician',
    comment: 'Pehli dafa Faisalabad mein itni transparent pricing dekhi hai. Ustad Tariq ne standard 300 Rs hi liye aur switchboard theek kar diya!',
  },
  {
    id: 'rev-2',
    bookingId: 'BK-7888',
    ustadId: 'ustad-103',
    customerName: 'Bilal Ahmad (Madina Town)',
    rating: 5,
    date: 'Yesterday',
    service: 'AC Technician',
    comment: 'Kamran bhai brought professional chemical foam gear. AC is throwing ice-cold air now. Highly recommended!',
  },
  {
    id: 'rev-3',
    bookingId: 'BK-7885',
    ustadId: 'ustad-104',
    customerName: 'Usman Ghani (D-Ground)',
    rating: 4.8,
    date: '2 days ago',
    service: 'Bike Mechanic',
    comment: 'Bike broke down near Jaranwala road. He arrived in 15 minutes, tuned the carburetor and fixed spark plug on spot.',
  }
];
