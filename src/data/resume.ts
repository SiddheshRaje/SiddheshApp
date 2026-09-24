export const profile = {
  name: "Siddhesh Raje",
  role: "Software Developer",
  tagline: "Building at the intersection of Blockchain & Artificial Intelligence",
  location: "Mumbai, India",
  email: "siddhesh.raje28@gmail.com",
  linkedin: "https://linkedin.com/in/siddheshraje28/",
  github: "https://github.com/SiddheshRaje",
  githubRepository: "https://github.com/SiddheshRaje/SiddheshApp",
  summary:
    "Over 3 years in blockchain technology, leading cross-functional teams through ambitious solutions—from client requirements to shippable technical systems.",
};

export type Block = {
  id: string;
  index: number;
  title: string;
  org: string;
  location: string;
  period: string;
  points: string[];
};

export const experience: Block[] = [
  {
    id: "0x4a2f",
    index: 3,
    title: "Technical Architect",
    org: "Blockchain Council",
    location: "Pune, India",
    period: "Dec 2022 — Present",
    points: [
      "Led migration of the entire assessment platform to ProProfs, coordinating engineering and clients through a smooth cutover.",
      "Ran 50+ instructor-led training sessions, partnering closely with instructors and the technical team on delivery.",
      "Designed and shipped two blockchain courses in partnership with SMEs and clients, from curriculum to delivery.",
      "Trained AI models on curated datasets and integrated them into a chatbot, lifting the quality of user interactions.",
    ],
  },
  {
    id: "0x8e11",
    index: 2,
    title: "Blockchain Developer Intern",
    org: "CogniTensor",
    location: "Mumbai, India",
    period: "Mar 2022 — Sep 2022",
    points: [
      "Built a cryptocurrency data-retrieval system in React.js with live API integration.",
      "Engineered a decentralized finance app focused on secure, efficient on-chain transactions.",
      "Built an interactive candlestick chart with Chart.js to visualize market trends and price action.",
    ],
  },
  {
    id: "0x1c07",
    index: 1,
    title: "Web Developer Intern",
    org: "White Oak",
    location: "Mumbai, India",
    period: "Jan 2020 — Mar 2020",
    points: [
      "Designed, built, and launched five production websites using React.js, JavaScript, Bootstrap, HTML, and CSS.",
      "Administered and optimized the database layer, keeping data management and troubleshooting seamless.",
      "Improved UI/UX across sites with a fully responsive front end.",
    ],
  },
];

export type Project = {
  name: string;
  period: string;
  stack: string[];
  points: string[];
  repo?: string;
};

export const projects: Project[] = [
  {
    name: "Cryptocurrency Tracker",
    period: "Jun 2022 — Sep 2022",
    stack: ["React.js", "Material UI", "Chart.js", "REST APIs"],
    repo: "",
    points: [
      "Responsive Material UI tracker with 24-hour, 30-day, and three-month cryptocurrency charts.",
      "Live data feeds for rank, price, and market cap with USD/INR conversion.",
    ],
  },
  {
    name: "Ethereum Decentralized App",
    period: "Aug 2021 — Feb 2022",
    stack: ["React.js", "Python", "Vite", "Web3.js", "MetaMask", "Bootstrap 4"],
    repo: "https://github.com/SiddheshRaje/EthereumDecentralizedApp",
    points: [
      "Secure, reliable crypto transactions via MetaMask and Web3.0 integration.",
      "Unique feature that renders transactions as dynamic GIFs for a more engaging record.",
    ],
  },
];

export const education = [
  {
    degree: "B.Sc. Business Computing in Information Systems",
    detail: "Minor in Blockchain",
    school: "University of Central Lancashire, Preston, UK",
    year: "2022",
    score: "3.7 GPA",
  },
  {
    degree: "B.A. English Literature",
    detail: "",
    school: "University of Mumbai, Mumbai, India",
    year: "2023",
    score: "4.0 GPA",
  },
];

export const certifications = [
  { name: "Certified Ethical Hacker", issuer: "EC-Council", year: "2019" },
  { name: "Solidity Development", issuer: "Udemy", year: "2021" },
  { name: "NFT Development", issuer: "Udemy", year: "2020" },
  { name: "Certified Blockchain Expert", issuer: "Blockchain Council", year: "2023" },
  { name: "Certified Blockchain Architect", issuer: "Blockchain Council", year: "2023" },
  { name: "Certified ChatGPT Expert", issuer: "Blockchain Council", year: "2024" },
];

export const skills = {
  Languages: ["Python", "SQL", "Solidity"],
  "Web Development": [
    "JavaScript",
    "Node.js",
    "React",
    "HTML",
    "CSS",
    "Bootstrap 4",
    "Figma",
  ],
  Database: ["MySQL", "AWS"],
  Tooling: ["IntelliJ IDEA", "Visual Studio", "Sublime Text"],
  Competencies: [
    "Project Management",
    "Leadership",
    "Decision Making",
    "Problem-Solving",
    "Analytics",
    "Communication",
  ],
};
