// Sample demonstration data for EventSphere Management System
// Note: As per project requirements, expos, booths, schedules, and exhibitor data are sample data for UI display.

export const sampleExpos = [
  {
    id: 'expo-1',
    title: 'Global Tech & AI Summit 2026',
    category: 'Technology & AI',
    date: 'November 15-18, 2026',
    location: 'Metropolitan Expo Center, Hall A',
    city: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    description: 'The premier international trade show highlighting next-generation artificial intelligence, robotics, and cloud computing ecosystems.',
    organizer: 'Nexus Global Exhibitions',
    boothCount: 120,
    expectedAttendees: '15,000+',
    featured: true,
    highlights: [
      'Keynotes from top global AI industry leaders',
      'Over 120 interactive technology booths',
      'Live robotics demonstration zone',
      'Dedicated startup pitch competition with angel investors'
    ]
  },
  {
    id: 'expo-2',
    title: 'International Healthcare & MedTech Expo',
    category: 'Healthcare',
    date: 'December 02-05, 2026',
    location: 'Grand Convention Hall, Hall B & C',
    city: 'Chicago, USA',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
    description: 'Explore the latest medical diagnostics, surgical robotics, biotechnology breakthroughs, and hospital equipment solutions.',
    organizer: 'HealthCare Innovation Forum',
    boothCount: 95,
    expectedAttendees: '10,000+',
    featured: true,
    highlights: [
      'Breakthrough surgical robotics demonstrations',
      'FDA compliance & global certification workshop',
      'Medical supply chain networking lounge',
      'CME-accredited professional lectures'
    ]
  },
  {
    id: 'expo-3',
    title: 'Clean Energy & EV Trade Fair 2026',
    category: 'Green Energy',
    date: 'January 12-15, 2027',
    location: 'Sunbelt Convention Center',
    city: 'Austin, Texas',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60',
    description: 'Showcasing solar energy, electric vehicles, battery innovations, and sustainable industrial grid technologies.',
    organizer: 'EcoFuture World Exhibitions',
    boothCount: 80,
    expectedAttendees: '12,500+',
    featured: true,
    highlights: [
      'Over 40 next-gen electric vehicle test drives',
      'Solar grid battery storage innovations',
      'Green hydrogen and sustainable infrastructure seminars',
      'Government incentives and procurement panel'
    ]
  },
  {
    id: 'expo-4',
    title: 'International Auto & Mobility Show',
    category: 'Automotive',
    date: 'February 20-24, 2027',
    location: 'Riverfront Exhibition Center',
    city: 'Detroit, Michigan',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop&q=60',
    description: 'The flagship automotive exhibition presenting concept cars, smart mobility solutions, and automotive supply chains.',
    organizer: 'Global Motor Events',
    boothCount: 150,
    expectedAttendees: '25,000+',
    featured: false,
    highlights: [
      'World premiere reveals of concept cars',
      'Connected vehicle telemetry displays',
      'Autonomous fleet safety testing exhibits',
      'Supplier-to-OEM B2B speed meetings'
    ]
  },
  {
    id: 'expo-5',
    title: 'Modern Retail & E-Commerce Expo',
    category: 'Retail & Fashion',
    date: 'March 10-13, 2027',
    location: 'Pacific Trade Pavilion',
    city: 'San Francisco, USA',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
    description: 'Connecting omnichannel brands, logistics providers, packaging designers, and e-commerce software platforms.',
    organizer: 'Retail Pioneers Alliance',
    boothCount: 110,
    expectedAttendees: '9,000+',
    featured: false,
    highlights: [
      'AI checkout and computerized smart shelving showcases',
      'Sustainable and circular packaging displays',
      'Cross-border fulfillment solutions',
      'Influencer marketing and brand creator zone'
    ]
  },
  {
    id: 'expo-6',
    title: 'Industrial Manufacturing & Automation Fair',
    category: 'Manufacturing',
    date: 'April 05-08, 2027',
    location: 'Great Lakes Arena & Expo',
    city: 'Cleveland, Ohio',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
    description: 'Advanced CNC machinery, 3D industrial printing, smart warehouse robotics, and Industry 4.0 automation systems.',
    organizer: 'American Industrial Council',
    boothCount: 135,
    expectedAttendees: '14,000+',
    featured: false,
    highlights: [
      'Heavy machinery live cutting & fabrication demonstrations',
      'Collaborative cobot safety workshops',
      'Industrial IoT sensor networks',
      'Workforce upskilling and training pavilions'
    ]
  }
];

export const sampleExhibitors = [
  {
    id: 'exh-1',
    name: 'NeuralPulse Technologies',
    category: 'Technology & AI',
    booth: 'Booth A-101',
    hall: 'Hall A',
    logo: 'bi-cpu',
    description: 'Specializing in edge AI compute cards, neural accelerators, and real-time computer vision engines for enterprise.',
    email: 'contact@neuralpulse.example.com',
    website: 'https://neuralpulse.example.com',
    featured: true
  },
  {
    id: 'exh-2',
    name: 'BioHeal Diagnostics',
    category: 'Healthcare',
    booth: 'Booth B-204',
    hall: 'Hall B',
    logo: 'bi-heart-pulse',
    description: 'Pioneering rapid point-of-care blood diagnostic chips and cloud-connected remote clinical monitors.',
    email: 'info@bioheal.example.com',
    website: 'https://bioheal.example.com',
    featured: true
  },
  {
    id: 'exh-3',
    name: 'VoltStream Motors',
    category: 'Automotive',
    booth: 'Booth C-105',
    hall: 'Hall C',
    logo: 'bi-ev-station',
    description: 'High-density lithium and solid-state electric vehicle powertrains, modular charging stations, and battery management software.',
    email: 'hello@voltstream.example.com',
    website: 'https://voltstream.example.com',
    featured: true
  },
  {
    id: 'exh-4',
    name: 'Solarix Green Solutions',
    category: 'Green Energy',
    booth: 'Booth A-312',
    hall: 'Hall A',
    logo: 'bi-sun',
    description: 'Next-gen bifacial perovskite solar panels and commercial microgrid energy storage inverters.',
    email: 'sales@solarixgreen.example.com',
    website: 'https://solarixgreen.example.com',
    featured: false
  },
  {
    id: 'exh-5',
    name: 'SmartCart Commerce AI',
    category: 'Retail & Fashion',
    booth: 'Booth D-110',
    hall: 'Hall D',
    logo: 'bi-cart4',
    description: 'Autonomous shopping cart systems and computer-vision powered cashierless store checkouts.',
    email: 'support@smartcart.example.com',
    website: 'https://smartcart.example.com',
    featured: false
  },
  {
    id: 'exh-6',
    name: 'RoboWeld Automation',
    category: 'Manufacturing',
    booth: 'Booth B-405',
    hall: 'Hall B',
    logo: 'bi-gear-wide-connected',
    description: '6-axis precision robotic welding arms, collaborative cobots, and automated laser fabrication cells.',
    email: 'inquiry@roboweld.example.com',
    website: 'https://roboweld.example.com',
    featured: false
  },
  {
    id: 'exh-7',
    name: 'CloudSync Enterprise',
    category: 'Technology & AI',
    booth: 'Booth A-102',
    hall: 'Hall A',
    logo: 'bi-cloud-check',
    description: 'Scalable hybrid cloud infrastructure, Kubernetes automation, and unified zero-trust cybersecurity mesh.',
    email: 'hello@cloudsync.example.com',
    website: 'https://cloudsync.example.com',
    featured: false
  },
  {
    id: 'exh-8',
    name: 'CareLink Telehealth',
    category: 'Healthcare',
    booth: 'Booth B-205',
    hall: 'Hall B',
    logo: 'bi-hospital',
    description: 'Integrated HIPAA-compliant virtual consultation platforms and patient vital sensor peripherals.',
    email: 'contact@carelink.example.com',
    website: 'https://carelink.example.com',
    featured: false
  }
];

export const sampleSchedule = [
  {
    id: 'sch-1',
    day: 'Day 1',
    date: 'Nov 15, 2026',
    time: '09:00 AM - 10:00 AM',
    topic: 'Opening Ceremony & Keynote: The Future of Trade & Global Markets',
    speaker: 'Dr. Evelyn Carter',
    speakerRole: 'Chief Innovation Strategist, World Expo Forum',
    room: 'Main Auditorium',
    type: 'Keynote'
  },
  {
    id: 'sch-2',
    day: 'Day 1',
    date: 'Nov 15, 2026',
    time: '10:30 AM - 12:00 PM',
    topic: 'Panel: Next-Gen AI in Enterprise & Production Automation',
    speaker: 'Marcus Vance, Priya Sharma, David Liu',
    speakerRole: 'Industry Executive Panel',
    room: 'Hall A - Stage 1',
    type: 'Panel Discussion'
  },
  {
    id: 'sch-3',
    day: 'Day 1',
    date: 'Nov 15, 2026',
    time: '01:30 PM - 03:00 PM',
    topic: 'Hands-on Workshop: Edge AI Sensors & Hardware Prototyping',
    speaker: 'Sarah Jenkins',
    speakerRole: 'Lead Robotics Engineer, NeuralPulse',
    room: 'Workshop Room 102',
    type: 'Workshop'
  },
  {
    id: 'sch-4',
    day: 'Day 2',
    date: 'Nov 16, 2026',
    time: '09:30 AM - 11:00 AM',
    topic: 'Sustainable Supply Chains & Clean Energy Mandates',
    speaker: 'Thomas Becker',
    speakerRole: 'VP Sustainability, Solarix Green',
    room: 'Hall B - Stage 2',
    type: 'Keynote'
  },
  {
    id: 'sch-5',
    day: 'Day 2',
    date: 'Nov 16, 2026',
    time: '11:30 AM - 01:00 PM',
    topic: 'Interactive Pitch Session: 10 Promising MedTech Startups',
    speaker: 'Selected Founders & Venture Judges',
    speakerRole: 'Healthcare Pitch Panel',
    room: 'Innovation Amphitheater',
    type: 'Pitch Session'
  },
  {
    id: 'sch-6',
    day: 'Day 2',
    date: 'Nov 16, 2026',
    time: '02:30 PM - 04:00 PM',
    topic: 'Digital Floor Planning & Modern Booth Engagement Tactics',
    speaker: 'Alicia Gomez',
    speakerRole: 'Expo Experience Director',
    room: 'Workshop Room 204',
    type: 'Workshop'
  },
  {
    id: 'sch-7',
    day: 'Day 3',
    date: 'Nov 17, 2026',
    time: '10:00 AM - 11:30 AM',
    topic: 'B2B International Networking & Trade Matchmaking Summit',
    speaker: 'Global Trade Delegates',
    speakerRole: 'International Business Forum',
    room: 'Grand Ballroom',
    type: 'Networking'
  },
  {
    id: 'sch-8',
    day: 'Day 3',
    date: 'Nov 17, 2026',
    time: '03:00 PM - 04:30 PM',
    topic: 'EventSphere Awards & Best Exhibitor Recognition Ceremony',
    speaker: 'EventSphere Committee',
    speakerRole: 'Official Closing Session',
    room: 'Main Auditorium',
    type: 'Awards'
  }
];

export const sampleBooths = [
  { id: 'A-101', hall: 'Hall A', size: '20x20 ft', price: '$2,500', status: 'Booked', exhibitor: 'NeuralPulse Technologies', category: 'Technology' },
  { id: 'A-102', hall: 'Hall A', size: '10x20 ft', price: '$1,800', status: 'Booked', exhibitor: 'CloudSync Enterprise', category: 'Technology' },
  { id: 'A-103', hall: 'Hall A', size: '10x10 ft', price: '$1,200', status: 'Available', exhibitor: null, category: 'Technology' },
  { id: 'A-104', hall: 'Hall A', size: '10x10 ft', price: '$1,200', status: 'Reserved', exhibitor: 'Pending Review', category: 'Technology' },
  { id: 'A-105', hall: 'Hall A', size: '15x15 ft', price: '$1,900', status: 'Available', exhibitor: null, category: 'Technology' },
  { id: 'A-106', hall: 'Hall A', size: '10x10 ft', price: '$1,200', status: 'Available', exhibitor: null, category: 'Technology' },
  
  { id: 'B-201', hall: 'Hall B', size: '10x10 ft', price: '$1,200', status: 'Available', exhibitor: null, category: 'Healthcare' },
  { id: 'B-202', hall: 'Hall B', size: '10x10 ft', price: '$1,200', status: 'Reserved', exhibitor: 'Global Health Inc', category: 'Healthcare' },
  { id: 'B-203', hall: 'Hall B', size: '15x15 ft', price: '$1,900', status: 'Available', exhibitor: null, category: 'Healthcare' },
  { id: 'B-204', hall: 'Hall B', size: '20x20 ft', price: '$2,500', status: 'Booked', exhibitor: 'BioHeal Diagnostics', category: 'Healthcare' },
  { id: 'B-205', hall: 'Hall B', size: '10x20 ft', price: '$1,800', status: 'Booked', exhibitor: 'CareLink Telehealth', category: 'Healthcare' },
  { id: 'B-206', hall: 'Hall B', size: '10x10 ft', price: '$1,200', status: 'Available', exhibitor: null, category: 'Healthcare' },

  { id: 'C-301', hall: 'Hall C', size: '20x20 ft', price: '$2,500', status: 'Available', exhibitor: null, category: 'Automotive' },
  { id: 'C-302', hall: 'Hall C', size: '10x20 ft', price: '$1,800', status: 'Available', exhibitor: null, category: 'Automotive' },
  { id: 'C-303', hall: 'Hall C', size: '10x10 ft', price: '$1,200', status: 'Reserved', exhibitor: 'Apex Auto Parts', category: 'Automotive' },
  { id: 'C-304', hall: 'Hall C', size: '10x10 ft', price: '$1,200', status: 'Booked', exhibitor: 'VoltStream Motors', category: 'Automotive' },
  { id: 'C-305', hall: 'Hall C', size: '15x15 ft', price: '$1,900', status: 'Available', exhibitor: null, category: 'Automotive' },
  { id: 'C-306', hall: 'Hall C', size: '10x10 ft', price: '$1,200', status: 'Available', exhibitor: null, category: 'Automotive' }
];

export const sampleDashboardStats = {
  totalExpos: 18,
  totalExhibitors: 142,
  registeredAttendees: 3450,
  upcomingSessions: 32,
  recentActivities: [
    { id: 1, action: 'User Registration', detail: 'New attendee registered for Global Tech Summit', time: '12 mins ago', icon: 'bi-person-check' },
    { id: 2, action: 'Booth Reservation', detail: 'Booth A-104 reserved by NeuralPulse Technologies', time: '45 mins ago', icon: 'bi-grid-3x3-gap' },
    { id: 3, action: 'Schedule Updated', detail: 'New speaker added to Clean Energy Panel', time: '2 hours ago', icon: 'bi-calendar-event' },
    { id: 4, action: 'Exhibitor Approved', detail: 'BioHeal Diagnostics confirmed for Hall B', time: '4 hours ago', icon: 'bi-building-check' },
    { id: 5, action: 'Badge Downloaded', detail: '14 attendees generated entry QR badges', time: '6 hours ago', icon: 'bi-qr-code' }
  ]
};

