import faceSwap from '../assets/projects/face-swap.svg'
import aiInterview from '../assets/projects/ai-interview.svg'
import imageGen from '../assets/projects/image-gen.svg'
import profileOpt from '../assets/projects/profile-opt.svg'
import cnn from '../assets/projects/cnn.svg'
import genai from '../assets/projects/genai.svg'
/* ------------------------------------------------------------------
   SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
   Edit this file to update the portfolio. Anything marked TODO is an
   intentional placeholder — fill it with real information only.
------------------------------------------------------------------- */

export const profile = {
  name: 'Ehtijad Ali Shah',
  shortName: 'EHTIJAD',
  role: 'Full-Stack AI Engineer',
  tagline: 'AI Agents · Machine Learning · Python · React',
  location: 'Gilgit-Baltistan, Pakistan',
  locationShort: 'GILGIT, PAKISTAN',
  availability: 'Open to remote & international projects',
  headline: 'Building Intelligent Products with AI and Code.',
  intro:
    "I'm Ehtijad Ali Shah, a Full-Stack AI Engineer specializing in AI agents, machine learning, and modern web applications. I turn complex ideas into practical digital experiences.",
  positioning:
    'Full-Stack AI Engineer helping businesses build intelligent applications, automate workflows, and develop modern digital products.',
  about: [
    "I'm an AI Engineer and Full-Stack Developer from Gilgit-Baltistan, Pakistan.",
    'My work focuses on developing intelligent systems, AI-driven applications, machine learning solutions, and scalable web experiences.',
    'From designing AI agents and integrating large language models to developing modern frontend and backend applications, I enjoy solving real-world problems through technology.',
    "I'm continuously exploring new technologies and building products that combine artificial intelligence with practical usability.",
  ],
  /** Put your photo at /public/profile.jpg — until then a monogram is shown. Never use someone else's photo. */
  photo: '/profile.jpg',
}

/** Leave a value as '' to hide it. Never invent URLs. */
export const links = {
  email: 'ehtyalee1919@gmail.com',
  phone: '+92 311 0868172',
  linkedin: 'https://www.linkedin.com/in/ehtijad-ali-1497623b9/',
  github: 'https://github.com/ehtijad-ali',
  fiverr: 'https://www.fiverr.com/saaimhl',
  upwork: 'https://www.upwork.com/freelancers/~015703142356b7fd16',
}

/** Contact form endpoint (e.g. a Formspree / Web3Forms / own API URL). Empty = form shows "needs configuration". */
export const contactEndpoint = ''

export const heroStats = [
  { value: '25', suffix: '+', label: ['AI / ML PROJECTS', 'DELIVERED ON FIVERR'] },
  { value: '750', suffix: '+', label: ['HOURS OF NUST AI', 'TRAINING COMPLETED'] },
  { value: '7', suffix: '', label: ['PROFESSIONAL', 'CERTIFICATIONS'] },
]

export type Experience = {
  period: string
  role: string
  org: string
  points: string[]
}

export const experience: Experience[] = [
  {
    period: 'NOV 2023 · NOW',
    role: 'Junior Data Scientist & AI Engineer',
    org: 'IT Directorate, Gilgit-Baltistan',
    points: [
      'Data analysis and organizational reporting.',
      'Predictive analytics and machine learning.',
      'Sales and customer data dashboards.',
      'Data-driven insights and visualization.',
      'AI and deep learning experimentation.',
      'Automation using Python and machine learning technologies.',
    ],
  },
  {
    period: '2022 · NOW',
    role: 'Freelance AI/ML Developer',
    org: 'Fiverr',
    points: [
      'Completed 25+ AI and machine learning projects.',
      'Developed machine learning and deep learning solutions.',
      'Worked on computer vision and NLP-related applications.',
      'Built Python-based AI solutions for different client requirements.',
    ],
  },
  {
    period: 'JUN 2024',
    role: 'Data Scientist & ML Specialist',
    org: 'Codio · Remote',
    points: ['Data science and machine learning work delivered remotely.'], // TODO add verified details
  },
  {
    period: 'JUL – AUG 2025',
    role: 'Machine Learning Intern',
    org: 'CodeAlpha',
    points: [
      'Practical machine learning development.',
      'Python-based ML implementation.',
      'Model development and experimentation.',
    ],
  },
  {
    period: 'APR – JUN 2025',
    role: 'Learning & Internship Programme',
    org: 'CloudCredits',
    points: ['Learning and internship experience.'], // TODO add verified details
  },
]

export const education = [
  {
    title: 'BS in Data Science',
    org: 'Karakoram International University, Pakistan',
    period: '2024 – NOW',
    note: 'In progress.',
  },
  {
    title: 'Data Science & AI Training',
    org: 'NUST + IT Directorate GB',
    period: 'JUN – DEC 2024',
    note: 'Six-month programme · 750+ hours of learning and practical training.',
  },
  {
    title: 'Intermediate in Computer Science',
    org: "King's College Jutial, Gilgit",
    period: '2020 – 2022',
    note: '',
  },
]

export type Certification = {
  title: string
  issuer: string
  date?: string // TODO
  url?: string // TODO — real credential URL only
  image?: string // e.g. '/certificates/google-ada.jpg'
}

export const certifications: Certification[] = [
  { title: 'Google Advanced Data Analytics', issuer: 'Google' },
  { title: 'Google Data Analytics', issuer: 'Google' },
  { title: 'Career Essentials in Generative AI', issuer: 'Google' },
  { title: 'Claude 101', issuer: 'Anthropic' },
  { title: 'AI Fluency', issuer: 'Anthropic' },
  { title: 'Intro to Deep Learning', issuer: 'Kaggle' },
  { title: 'Generative AI', issuer: 'Pak Angels' },
]

export const skillGroups = [
  { title: 'AI & Machine Learning', items: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'Keras', 'Scikit-learn', 'PyTorch', 'Model Training', 'Predictive Analytics'] },
  { title: 'AI Agents & LLM Engineering', items: ['Large Language Models', 'AI Agents', 'Agentic Workflows', 'RAG', 'LangChain', 'Prompt Engineering', 'API Integrations', 'Workflow Automation'] },
  { title: 'Computer Vision', items: ['OpenCV', 'YOLO', 'MediaPipe', 'Image Processing', 'Object Detection', 'CV Applications'] },
  { title: 'Backend Development', items: ['Python', 'FastAPI', 'REST APIs', 'SQL', 'PostgreSQL', 'SQLite', 'Database Integration'] },
  { title: 'Frontend Development', items: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Responsive Design'] },
  { title: 'Automation & Tools', items: ['n8n', 'Docker', 'Git', 'GitHub', 'Linux', 'VS Code', 'AWS', 'Azure'] },
]

/** Wordmarks shown in the "Built with" marquee */
export const tools = ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'OpenCV', 'FastAPI', 'React', 'TypeScript', 'n8n', 'Docker', 'PostgreSQL', 'AWS']

export const services = [
  { title: 'AI Development', text: 'Custom AI applications, intelligent systems, and AI integrations.', tags: ['Python','FastAPI','AI integration'] },
  { title: 'AI Agent Development', text: 'AI agents, agentic workflows, tool integrations, and business automation.', tags: ['LangChain','Agents','Tool calling'] },
  { title: 'Machine Learning', text: 'Predictive models, classification, regression, data analysis, and ML applications.', tags: ['Scikit-learn','TensorFlow','PyTorch'] },
  { title: 'Computer Vision', text: 'Object detection, image processing, visual recognition, and computer vision applications.', tags: ['OpenCV','YOLO','MediaPipe'] },
  { title: 'Full-Stack Web Development', text: 'Modern React applications, Python backends, REST APIs, and database-driven platforms.', tags: ['React','TypeScript','PostgreSQL'] },
  { title: 'LLM & RAG Applications', text: 'LLM integration, document-based question answering, and retrieval-augmented generation.', tags: ['LLMs','RAG','Document Q&A'] },
  { title: 'Workflow Automation', text: 'n8n workflows, API integrations, and repetitive business process automation.', tags: ['n8n','APIs','Integrations'] },
  { title: 'Data Science', text: 'Data analysis, visualization, predictive analytics, and actionable insights.', tags: ['Python','Visualization','Analytics'] },
]

export const process = [
  { title: 'Discover', text: 'Understanding the goal, the users and the data behind the problem.' },
  { title: 'Data & Design', text: 'Exploring data, choosing the approach and mapping the product flow.' },
  { title: 'Model', text: 'Training, prompting or orchestrating the AI that powers the product.' },
  { title: 'Build', text: 'Shipping a fast, accessible app with a clean API around the intelligence.' },
  { title: 'Launch', text: 'Testing, deploying and improving with real-world feedback.' },
]

export const categories = [
  'AI Applications',
  'AI Agent Systems',
  'Machine Learning',
  'Computer Vision',
  'NLP & LLM',
  'Full-Stack Web',
  'Business Automation',
  'Data Science',
] as const

export type Project = {
  id: string
  title: string
  category: (typeof categories)[number]
  year: string
  summary: string
  overview: string
  role: string
  tech: string[]
  image?: string // '/projects/xyz.jpg'
  github?: string // real URL only
  demo?: string // real URL only
  placeholder?: boolean
}

/** Add screenshots to /public/projects and set 'image'. Add github / demo URLs only when real. */
export const projects: Project[] = [
  {
    id: 'face-swap-detection',
    image: faceSwap,
    title: 'Face-Swap Detection Interview System',
    category: 'Computer Vision',
    year: '',
    summary: 'Detects face-swapping and identity fraud during online interviews in real time.',
    overview:
      'An AI-based interview platform that detects face-swapping or identity fraud during online interviews using computer vision techniques. The system verifies candidate identity in real time, records the interview session, and securely stores video and verification data in the company database.',
    role: 'AI & full-stack development',
    tech: ['Computer Vision', 'Face Verification', 'Video Recording', 'Database'],
  },
  {
    id: 'ai-interview',
    image: aiInterview,
    title: 'AI Interview System',
    category: 'AI Agent Systems',
    year: '',
    summary: 'Candidates are interviewed by an AI bot; responses are recorded and stored for evaluation.',
    overview:
      'An AI-driven interview platform where candidates interact with an AI bot for interviews. The system records responses and securely stores interview data in the company database for evaluation.',
    role: 'AI & full-stack development',
    tech: ['Conversational AI', 'NLP', 'Database'],
  },
  {
    id: 'image-generation',
    image: imageGen,
    title: 'AI Image Generation Tool',
    category: 'AI Applications',
    year: '',
    summary: 'Generate up to 20 images per prompt and download them all as a ZIP.',
    overview:
      'A web-based AI image generation platform that allows users to generate up to 20 images per prompt with no strict generation limits. The system supports batch image creation and lets users download all generated images as a ZIP file.',
    role: 'Design & development',
    tech: ['Generative AI', 'Web App', 'Batch Processing'],
  },
  {
    id: 'profile-optimizer',
    image: profileOpt,
    title: 'Profile Optimizer Extension',
    category: 'NLP & LLM',
    year: '',
    summary: 'Browser extension that uses AI to improve LinkedIn / Fiverr profiles.',
    overview:
      'A browser extension that analyzes and optimizes user profiles (e.g. LinkedIn / Fiverr) using AI. It suggests improvements to headlines, descriptions and keywords, and overall profile visibility, using NLP models.',
    role: 'Design & development',
    tech: ['Browser Extension', 'NLP', 'LLM'],
  },
  {
    id: 'image-classification',
    image: cnn,
    title: 'CNN Image Classifier',
    category: 'Machine Learning',
    year: '',
    summary: 'Convolutional neural network reaching 92% accuracy on a custom dataset.',
    overview:
      'A convolutional neural network image classifier built with TensorFlow, achieving 92% accuracy on a custom dataset.',
    role: 'Model development',
    tech: ['TensorFlow', 'CNN', 'Python'],
  },
  {
    id: 'genai-tools',
    image: genai,
    title: 'Generative AI Tools',
    category: 'NLP & LLM',
    year: '',
    summary: 'Language translation and FAQ chatbot tools built with NLP and APIs.',
    overview: 'Language translation and FAQ chatbot tools built using NLP techniques and APIs to enhance user interactions.',
    role: 'Development',
    tech: ['NLP', 'Chatbot', 'APIs'],
  },
]

/** Only real client feedback. Empty array = "coming soon" state. */
export const testimonials: { quote: string; name: string; source: string }[] = []
