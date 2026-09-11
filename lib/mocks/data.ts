import {
  ChallengeDetail,
  ImpactMetric,
  PartnerMatch,
  PilotEvidence,
  Project,
  Proposal,
  ReportAnalysis,
  SolutionSummary,
  Team,
  UniversityMatch,
} from '@/types';

// Canonical Challenge JNS-1048
export const CANONICAL_CHALLENGE: ChallengeDetail = {
  id: 'JNS-1048',
  title: 'Rural Drinking Water Reliability & Multi-Village Borewell Testing',
  domain: 'Water & Sanitation',
  status: 'PILOT',
  priority: 'HIGH',
  signalCount: 17,
  evidenceCount: 8,
  confirmationCount: 12,
  affectedArea: 'Namkum Block & Tiril Ashram, Ranchi District',
  lat: 23.3364,
  lng: 85.3475,
  problemStatement:
    'Residents across 3 panchayats in Namkum Block report recurring seasonal turbidity, pungent iron odor, and intermittent borehole pump failures. Over 8,500 people depend on these borewells, experiencing repeated gastrointestinal illnesses and supply halts of 5-10 days during monsoon months without municipal response.',
  affectedPopulationEstimate: 8500,
  isDemoData: true,
  requiredExpertise: [
    'Environmental Water Chemistry',
    'Low-Cost Adsorption Filtration',
    'IoT Telemetry & Remote Sensing',
    'Community Water Governance',
  ],
  evidence: [
    {
      id: 'EV-101',
      type: 'video',
      url: 'https://cdn.pixabay.com/video/2024/11/07/240320_medium.mp4',
      caption: 'Turbid brown water sample collected from community handpump in Namkum village.',
      submittedAt: '2026-08-12T09:30:00Z',
    },
    {
      id: 'EV-102',
      type: 'video',
      url: 'https://videos.pexels.com/video-files/1430660/1430660-hd_1280_720_30fps.mp4',
      caption: 'Field chemical test strip indicating elevated iron (>1.5 mg/L) and high total dissolved solids.',
      submittedAt: '2026-08-14T11:15:00Z',
    },
    {
      id: 'EV-103',
      type: 'voice',
      url: '#',
      caption: 'Gram Pradhan Audio Note: "पंप में लगातार पीला पानी आ रहा है, बच्चे बीमार हो रहे हैं, त्वरित तकनीकी मदद चाहिए।"',
      submittedAt: '2026-08-15T16:00:00Z',
    },
    {
      id: 'EV-104',
      type: 'document',
      url: '#',
      caption: 'Panchayat Samiti formal resolution recording 17 handpump downtime complaints in July-August.',
      submittedAt: '2026-08-16T10:00:00Z',
    },
  ],
};

// Seed Challenges List
export const SEED_CHALLENGES: ChallengeDetail[] = [
  CANONICAL_CHALLENGE,
  {
    id: 'JNS-1012',
    title: 'Abandoned Open-Cast Mine Acidic Runoff Contaminating Agro Wells',
    domain: 'Environmental Monitoring',
    status: 'VERIFIED',
    priority: 'HIGH',
    signalCount: 24,
    evidenceCount: 11,
    confirmationCount: 19,
    affectedArea: 'Jharia Coal Belt, Dhanbad District',
    lat: 23.7512,
    lng: 86.4184,
    problemStatement:
      'Acid mine drainage with high sulfate levels is seeping into shallow irrigation aquifers used by 45 vegetable farmers during dry season cultivation.',
    affectedPopulationEstimate: 12000,
    isDemoData: true,
    requiredExpertise: ['Hydrology', 'Acid Mine Drainage Remediation', 'Soil Chemistry'],
    evidence: [
      {
        id: 'EV-201',
        type: 'video',
        url: 'https://videos.pexels.com/video-files/38262510/16246113_360_640_60fps.mp4',
        caption: 'Discolored acidic drainage pond within 300m of community agricultural land.',
        submittedAt: '2026-08-10T14:20:00Z',
      },
    ],
  },
  {
    id: 'JNS-1025',
    title: 'Culvert Erosion Severing Monsoonal Access to Kasturba Vidyalaya',
    domain: 'Infrastructure & Access',
    status: 'MATCHING',
    priority: 'HIGH',
    signalCount: 14,
    evidenceCount: 6,
    confirmationCount: 28,
    affectedArea: 'Barhi Block, Hazaribagh District',
    lat: 23.9925,
    lng: 85.3647,
    problemStatement:
      'Flash floods each July carve away earthen approaches to the causeway, isolating 340 residential schoolgirls from medical and food replenishment routes.',
    affectedPopulationEstimate: 4500,
    isDemoData: true,
    requiredExpertise: ['Geotechnical Stabilization', 'Hydraulic Culvert Design', 'Precast Concrete Engineering'],
    evidence: [
      {
        id: 'EV-301',
        type: 'video',
        url: 'https://videos.pexels.com/video-files/32575402/13890490_640_360_30fps.mp4',
        caption: 'Washout erosion on the rural approach embankment.',
        submittedAt: '2026-08-18T08:00:00Z',
      },
    ],
  },
  {
    id: 'JNS-1033',
    title: 'Solar Cold-Storage Chain Dropout for Tribal Mahua & Lac Collectives',
    domain: 'Agriculture & Livelihood',
    status: 'TEAM_FORMED',
    priority: 'MEDIUM',
    signalCount: 19,
    evidenceCount: 7,
    confirmationCount: 15,
    affectedArea: 'Torpa Block, Khunti District',
    lat: 23.0722,
    lng: 85.2796,
    problemStatement:
      'Off-grid solar micro-cold rooms suffer inverter thermal throttling during peak humidity, causing 30% spoilage of forest produce before weekly haat auctions.',
    affectedPopulationEstimate: 6200,
    isDemoData: true,
    requiredExpertise: ['Thermal Energy Storage', 'Solar Inverter Cooling', 'Post-Harvest Supply Chain'],
    evidence: [
      {
        id: 'EV-401',
        type: 'video',
        url: 'https://videos.pexels.com/video-files/34417959/14580851_640_360_30fps.mp4',
        caption: 'Spoiled produce bins outside the cooperative packing center.',
        submittedAt: '2026-08-20T12:00:00Z',
      },
    ],
  },
  {
    id: 'JNS-1055',
    title: 'Plastic Siltation Choking Subarnarekha Tributary Natural Canals',
    domain: 'Waste Management',
    status: 'PROTOTYPE',
    priority: 'MEDIUM',
    signalCount: 31,
    evidenceCount: 14,
    confirmationCount: 42,
    affectedArea: 'Mango & Kadma, Jamshedpur Urban Fringe',
    lat: 22.8046,
    lng: 86.2029,
    problemStatement:
      'Single-use plastic accumulation behind unmaintained weir gates causes backwater flooding into low-income settlements along the Subarnarekha floodplain.',
    affectedPopulationEstimate: 21000,
    isDemoData: true,
    requiredExpertise: ['Floating Debris Interception', 'Circular Mechanical Sorting', 'Urban Hydrology'],
    evidence: [
      {
        id: 'EV-501',
        type: 'video',
        url: 'https://videos.pexels.com/video-files/4513383/4513383-hd_1280_720_30fps.mp4',
        caption: 'Debris mat blocking the canal weir outlet.',
        submittedAt: '2026-08-05T17:30:00Z',
      },
    ],
  },
  {
    id: 'JNS-1061',
    title: 'Arsenic Hotspot Early Detection in Floodplain Shallow Tube Wells',
    domain: 'Water & Sanitation',
    status: 'VALIDATING',
    priority: 'HIGH',
    signalCount: 9,
    evidenceCount: 4,
    confirmationCount: 7,
    affectedArea: 'Udhwa Block, Sahebganj District',
    lat: 25.2425,
    lng: 87.6433,
    problemStatement:
      'Signs of skin keratosis among villagers drinking from private unmapped shallow handpumps (<40 feet) along the Ganga riverbed belt.',
    affectedPopulationEstimate: 14000,
    isDemoData: true,
    requiredExpertise: ['Trace Metal Detection', 'Community Health Epidemiology', 'Hydrogeology'],
    evidence: [],
  },
  {
    id: 'JNS-1070',
    title: 'Peri-Urban Stubble & Scrap Tire Burning Near School Perimeter',
    domain: 'Clean Air & Health',
    status: 'SIGNAL',
    priority: 'LOW',
    signalCount: 5,
    evidenceCount: 2,
    confirmationCount: 3,
    affectedArea: 'Chas Sub-Division, Bokaro District',
    lat: 23.6693,
    lng: 86.1511,
    problemStatement:
      'Night-time open scrap burning causing dense particulate haze over 2 government schools prior to morning assembly.',
    affectedPopulationEstimate: 3200,
    isDemoData: true,
    requiredExpertise: ['Air Quality Sensing', 'Solid Waste Regulation', 'Civic Enforcement'],
    evidence: [],
  },
  {
    id: 'JNS-1082',
    title: 'Off-Grid Health Centre Solar Vaccine Chiller Power Continuity',
    domain: 'Healthcare Access',
    status: 'DEPLOYED',
    priority: 'HIGH',
    signalCount: 22,
    evidenceCount: 9,
    confirmationCount: 33,
    affectedArea: 'Shikaripara Block, Dumka District',
    lat: 24.2676,
    lng: 87.2486,
    problemStatement:
      'Cold-chain vaccine fridges lost power during 3-day continuous rain spells, putting critical infant immunization batches at risk.',
    affectedPopulationEstimate: 18500,
    isDemoData: true,
    requiredExpertise: ['Renewable Energy Storage', 'Biomedical Cold-Chain', 'Telemetry Monitoring'],
    evidence: [],
  },
  {
    id: 'JNS-1090',
    title: 'Gravity Water Intake Silt Interceptor for Hill Spring Network',
    domain: 'Water & Sanitation',
    status: 'REUSABLE',
    priority: 'MEDIUM',
    signalCount: 16,
    evidenceCount: 8,
    confirmationCount: 21,
    affectedArea: 'Netarhat Plateau, Latehar District',
    lat: 23.4833,
    lng: 84.2667,
    problemStatement:
      'Hill spring stream intakes silt up with fine red laterite clay after heavy mountain showers, choking distribution valves.',
    affectedPopulationEstimate: 5100,
    isDemoData: true,
    requiredExpertise: ['Sedimentation Hydraulics', 'Gravity Pipeline Engineering'],
    evidence: [],
  },
];

// Canonical Project JNP-204
export const CANONICAL_PROJECT: Project = {
  id: 'JNP-204',
  challengeId: 'JNS-1048',
  title: 'Community Water Quality Monitoring & Adsorption Filtration Pilot',
  status: 'ACTIVE',
  stage: 'PILOT',
  milestones: [
    {
      id: 'MS-201',
      name: 'Baseline Water Assay & Contaminant Profiling',
      owner: 'Dr. S. Mukherjee (BIT Mesra)',
      dueDate: '2026-08-25',
      status: 'DONE',
      deliverable: '12-Point Laboratory Chemistry & Turbidity Report',
    },
    {
      id: 'MS-202',
      name: 'Modular Adsorption Gravity Filter Design & Fabrication',
      owner: 'Prof. R. Tigga & Student Tech Team',
      dueDate: '2026-09-02',
      status: 'DONE',
      deliverable: '200 LPH Biochar-Alumina Demonstration Unit',
    },
    {
      id: 'MS-203',
      name: 'Low-Cost IoT Optical Turbidity Sensor Node Deployment',
      owner: 'AquaTech Solutions & Electronics Lab',
      dueDate: '2026-09-07',
      status: 'DONE',
      deliverable: '3 Solar-Powered Telemetry Nodes Connected',
    },
    {
      id: 'MS-204',
      name: '45-Day Community Field Testing & Water Committee Handover',
      owner: 'Namkum Gram Panchayat & Team JanSetu',
      dueDate: '2026-09-28',
      status: 'IN_PROGRESS',
      deliverable: 'Continuous Quality Dashboard & Jal Sahiya Logbook',
    },
    {
      id: 'MS-205',
      name: 'Impact Audit & Standardized Deployment Blueprint',
      owner: 'Tata Steel CSR & Academic Evaluator',
      dueDate: '2026-10-10',
      status: 'PENDING',
      deliverable: 'Scalable Open-Hardware Water Station Blueprint',
    },
  ],
};

// University Matches for JNS-1048
// Sums strictly must equal score per contract rule:
// Domain 35, Faculty 25, Past 15, Facilities 10, Location 5, Availability 10 = Total 100
export const SEED_UNIVERSITY_MATCHES: UniversityMatch[] = [
  {
    institutionId: 'INST-01',
    institutionName: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    score: 94,
    breakdown: [
      { label: 'Domain expertise in water purification & chemical engineering', points: 35 },
      { label: 'Relevant faculty leads (Dr. Mukherjee & Environmental Lab)', points: 24 },
      { label: 'Past rural water sensor deployment fit', points: 13 },
      { label: 'Spectrometry & materials testing facility access', points: 9 },
      { label: 'Proximity to Namkum Block (<18 km reach)', points: 5 },
      { label: 'Active student innovation cell team availability', points: 8 },
    ],
    isDemoData: true,
  },
  {
    institutionId: 'INST-02',
    institutionName: 'National Institute of Technology (NIT) Jamshedpur',
    score: 84,
    breakdown: [
      { label: 'Civil & Environmental Engineering expertise', points: 30 },
      { label: 'Hydrology faculty mentors', points: 21 },
      { label: 'Related Subarnarekha basin pilot history', points: 12 },
      { label: 'Water testing laboratories', points: 8 },
      { label: 'Regional reach to South Chota Nagpur', points: 4 },
      { label: 'Team availability', points: 9 },
    ],
    isDemoData: true,
  },
  {
    institutionId: 'INST-03',
    institutionName: 'IIT (Indian School of Mines), Dhanbad',
    score: 79,
    breakdown: [
      { label: 'Hydrogeology and environmental science domain depth', points: 33 },
      { label: 'Senior environmental engineering faculty', points: 20 },
      { label: 'Groundwater modeling fit', points: 11 },
      { label: 'Advanced analytical instrumentation', points: 10 },
      { label: 'Distance from Ranchi (~150 km)', points: 2 },
      { label: 'Postgraduate cohort availability', points: 3 },
    ],
    isDemoData: true,
  },
];

// Partner Matches for JNS-1048
export const SEED_PARTNER_MATCHES: PartnerMatch[] = [
  {
    partnerId: 'PART-01',
    partnerName: 'Tata Steel Foundation — Rural Water Initiative',
    score: 92,
    canContribute: [
      'CSR hardware prototyping grants',
      'Field testing lab validation',
      'Community Jal Sahiya network mobilization',
      'Industrial fabrication access',
    ],
    isDemoData: true,
  },
  {
    partnerId: 'PART-02',
    partnerName: 'AquaTech Rural Sensors & IoT Labs',
    score: 87,
    canContribute: [
      'Low-power optical turbidity sensors',
      'Solar telemetry battery packs',
      'Hardware mentorship & firmware support',
    ],
    isDemoData: true,
  },
  {
    partnerId: 'PART-03',
    partnerName: 'Central Coalfields Sustainable Development Cell',
    score: 78,
    canContribute: [
      'Geochemical testing equipment',
      'Borehole logging equipment',
      'CSR deployment support',
    ],
    isDemoData: true,
  },
];

// Canonical Team for JNS-1048
export const CANONICAL_TEAM: Team = {
  id: 'TEAM-301',
  challengeId: 'JNS-1048',
  facultyMentor: 'Dr. S. Mukherjee (Department of Chemical & Environmental Eng, BIT Mesra)',
  members: [
    { name: 'Ananya Sharma', discipline: 'Chemical Engineering (Final Year)' },
    { name: 'Rohan Soren', discipline: 'IoT & Electronics Engineering' },
    { name: 'Priya Kispotta', discipline: 'Civil & Water Resources' },
    { name: 'Amitav Verma', discipline: 'Data Analytics & Modeling' },
  ],
};

// Canonical Proposal for JNS-1048
export const CANONICAL_PROPOSAL: Proposal = {
  id: 'PROP-401',
  teamId: 'TEAM-301',
  title: 'Low-Cost Biochar-Alumina Adsorption Cartridge with Telemetric Turbidity Warning',
  problemUnderstanding:
    'Namkum community borewells suffer from dual failure: iron oxide precipitation staining supply channels, combined with unannounced seasonal bacterial turbidity spikes during high water-table monsoons.',
  approach:
    'We combine a two-stage local biochar + activated alumina gravity cartridge (costing <₹3,500 per tapstand) with an optical nephelometric sensor node transmitting real-time NTU logs via low-power GSM.',
  expectedImpact:
    'Guaranteed sub-1.0 NTU turbidity and safe potable water access for 1,400+ households across 3 hamlets with zero recurring electricity cost.',
  prototypePlan:
    'Fabricate 3 pilot gravity cartridges using locally sourced bamboo biochar and food-grade HDPE barrels in the BIT Mesra workshop.',
  testingPlan:
    '45-day continuous assay: weekly laboratory spectrophotometer testing paired with automated hourly IoT turbidity and conductivity telemetry.',
  durationWeeks: 8,
  estimatedCostRange: '₹65,000 – ₹95,000 (Covered by Tata Steel CSR Offer)',
};

// Pilot Evidence for JNP-204
export const CANONICAL_PILOT_EVIDENCE: PilotEvidence[] = [
  {
    id: 'PE-01',
    projectId: 'JNP-204',
    type: 'photo',
    url: 'https://videos.pexels.com/video-files/13564829/13564829-hd_1280_720_25fps.mp4',
    note: 'Demonstration 200 LPH gravity biochar-alumina column installed at Tiril Ashram community borewell stand.',
  },
  {
    id: 'PE-02',
    projectId: 'JNP-204',
    type: 'test_report',
    url: '#',
    note: 'BIT Mesra Central Testing Laboratory Certified Spectrophotometry: Iron reduced from 1.82 mg/L to 0.14 mg/L (well below WHO 0.3 mg/L threshold).',
  },
  {
    id: 'PE-03',
    projectId: 'JNP-204',
    type: 'measurement',
    url: '#',
    note: 'Real-time optical turbidity telemetry log: Mean NTU dropped from 18.4 NTU (untreated) to 0.85 NTU (treated output) over 180 continuous operating hours.',
  },
  {
    id: 'PE-04',
    projectId: 'JNP-204',
    type: 'photo',
    url: 'https://videos.pexels.com/video-files/7647682/7647682-hd_1280_720_30fps.mp4',
    note: 'Field training workshop with 8 village Jal Sahiyas on weekly backwash protocol.',
  },
];

// Impact Metrics for JNP-204
export const CANONICAL_IMPACT_METRICS: ImpactMetric[] = [
  {
    id: 'IM-01',
    projectId: 'JNP-204',
    label: 'People Reached with Safe Drinking Water',
    value: '8,500 Citizens (1,420 Households)',
    source: 'Namkum Gram Panchayat Water Audit',
    date: 'September 2026',
    method: 'Household tapstand count and weekly water log',
    isDemoData: true,
  },
  {
    id: 'IM-02',
    projectId: 'JNP-204',
    label: 'Turbidity & Particulate Reduction',
    value: '95.4% Turbidity Reduction (<0.9 NTU)',
    source: 'BIT Mesra Environmental Chemical Lab',
    date: 'August 2026',
    method: 'Nephelometric Spectrophotometry (ISO 7027)',
    isDemoData: true,
  },
  {
    id: 'IM-03',
    projectId: 'JNP-204',
    label: 'Daily Safe Potable Water Delivered',
    value: '32,000 Litres / Day',
    source: 'AquaTech IoT Telemetry In-Line Meter',
    date: 'September 2026',
    method: 'Calibrated pulse hall-effect flow sensor',
    isDemoData: true,
  },
  {
    id: 'IM-04',
    projectId: 'JNP-204',
    label: 'Contamination Anomaly Alert Response',
    value: 'Reduced from 14 Days to 4 Hours',
    source: 'Panchayat WhatsApp Civic Alert Node',
    date: 'September 2026',
    method: 'Telemetry threshold trigger audit log',
    isDemoData: true,
  },
];

// Reusable Solutions Catalog
export const SEED_SOLUTIONS: SolutionSummary[] = [
  {
    id: 'SOL-301',
    title: 'Gravity-Fed Biochar-Alumina Adsorption Filter for High-Iron Rural Wells',
    domain: 'Water & Sanitation',
    originChallengeId: 'JNS-1048',
    similarityToCurrentChallenge: 98,
  },
  {
    id: 'SOL-302',
    title: 'Low-Power Optical Turbidity IoT Sentinel for Community Handpumps',
    domain: 'Water & Sanitation',
    originChallengeId: 'JNS-1048',
    similarityToCurrentChallenge: 92,
  },
  {
    id: 'SOL-303',
    title: 'Limestone Channel Wetland Interceptor for Acid Mine Infiltration',
    domain: 'Environmental Monitoring',
    originChallengeId: 'JNS-1012',
    similarityToCurrentChallenge: 84,
  },
  {
    id: 'SOL-304',
    title: 'Phase-Change Thermal Buffer Unit for Solar Vaccine Cold-Chain Boxes',
    domain: 'Healthcare Access',
    originChallengeId: 'JNS-1082',
    similarityToCurrentChallenge: 76,
  },
];

// Demo Fallback AI Structuring Analysis
export const FALLBACK_AI_ANALYSIS: ReportAnalysis = {
  domain: 'Water & Sanitation',
  domainConfidence: 94,
  issueType: 'Groundwater Contamination & Infrastructure Outage',
  summary:
    'Seasonal turbidity and iron particulate contamination causing intermittent borehole supply failure and community health concerns.',
  priority: 'HIGH',
  priorityConfidence: 89,
  suggestedExpertise: [
    'Environmental Water Chemistry',
    'Low-Cost Adsorption Filtration',
    'IoT Telemetry & Remote Sensing',
  ],
  source: 'saved-fallback',
};
