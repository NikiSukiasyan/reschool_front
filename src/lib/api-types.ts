// --- Shared / Reused ---
export interface Technology {
  id: number;
  name: string;
  slug: string;
}

export interface Location {
  id: number;
  city: string;
  address: string;
}

// Alias to avoid conflict with browser's built-in Location type
export type ApiLocation = Location;

export interface Topic {
  id: number;
  title: string;
}

export interface Outcome {
  id: number;
  title: string;
}

// --- Course ---
export interface CourseList {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  format: string;
  certificate: boolean;
  internship: boolean;
  image: string;
  category: string;
  technologies: Technology[];
  locations: Location[];
  hero_label: string | null;
  hero_subtitle: string | null;
  hero_detail: string | null;
  hero_accent: string | null;
  hero_icon: string | null;
  hero_students: string | null;
  show_in_hero: boolean;
}

export interface CourseStage {
  id: number;
  title: string;
  goal: string;
  prerequisite: string;
  duration: string;
  schedule: string;
  price: string;
  start_date: string;
  topics: Topic[];
  outcomes: Outcome[];
}

export interface CourseDetail extends CourseList {
  full_description: string;
  instructor: string;
  computer_requirements: string;
  stages: CourseStage[];
  mentors: Mentor[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
}

// --- Blog ---
export interface BlogPostList {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string; // ISO 8601
  read_time: string;
  excerpt: string;
  author: string;
  image: string | null;
  is_featured: boolean;
}

export interface BlogPostDetail extends BlogPostList {
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
}

// --- Testimonial ---
export interface Testimonial {
  id: number;
  name: string;
  course: string;
  quote: string;
  image: string;
  badge: string | null;
  category: string;
}

// --- Partner ---
export interface Partner {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
}

// --- Mentor ---
export interface Mentor {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
  experience_years: number | null;
  specializations: string[] | null;
  linkedin: string | null;
  facebook: string | null;
  email: string | null;
}

// --- Homepage Sections ---
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string | null;
  button_text: string | null;
  button_link: string | null;
}

export interface Statistic {
  id: number;
  value: string;
  suffix: string;
  label: string;
  color: string;
}

export interface WhyUsCard {
  id: number;
  title: string;
  description: string;
  image: string | null;
}

export interface ProcessStep {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

// --- About Page Sections ---
export interface Value {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface TimelineEntry {
  id: number;
  year: string;
  title: string;
  description: string;
}

// --- FAQ ---
export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
}

// --- Settings ---
export interface SettingsResponse {
  contact: {
    phone: string;
    email: string;
    address: string;
    working_hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
  site: {
    site_name: string;
    site_description: string;
    mission_text: string;
  };
}

// --- Aggregated Page Responses ---
export interface HomePageData {
  hero_cards: CourseList[];
  banners: Banner[];
  statistics: Statistic[];
  courses: CourseList[];
  why_us: WhyUsCard[];
  process: ProcessStep[];
  testimonials: Testimonial[];
  partners: Partner[];
}

export interface AboutPageData {
  values: Value[];
  timeline: TimelineEntry[];
  mentors: Mentor[];
  statistics: Statistic[];
}

// --- Registration ---
export interface RegistrationPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  course_id: number;
  city: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface RegistrationResponse {
  message: string;
  id: number;
}
