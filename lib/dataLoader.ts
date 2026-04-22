import fs from "fs";
import path from "path";

function readData<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function loadAboutData() {
  return readData<AboutData>("about.json");
}

export function loadClientsData() {
  return readData<ClientsData>("clients.json");
}

export function loadTrustData() {
  return readData<TrustData>("trust.json");
}

export function loadBlogsData() {
  return readData<BlogsData>("blogs.json");
}

export function loadBlogBySlug(slug: string): BlogPost | null {
  const data = readData<BlogsData>("blogs.json");
  const all = [...data.popularPosts, ...data.newestPosts];
  return all.find((p) => p.slug === slug) ?? null;
}

export function loadServicesData() {
  return readData<ServicesData>("services.json");
}

export function loadCaseStudiesData() {
  return readData<CaseStudiesData>("casestudies.json");
}

export function loadSectionsConfig() {
  return readData<SectionsConfig>("sections.json");
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  img: string;
  objectPos: string;
}

export interface Award {
  id: string;
  name: string;
  description: string;
  year: string;
  icon: string;
}

export interface AboutData {
  storyTitle: string;
  storyText: string;
  purposeTitle: string;
  purposeText: string;
  teamTitle: string;
  teamSubtitle: string;
  teamMembers: TeamMember[];
  awardsTitle: string;
  awardsSubtitle: string;
  awards: Award[];
  brandTitle: string;
  brandText: string;
  impactTitle: string;
  impactText: string;
  heroBanner: string;
  brandImage: string;
  impactImage: string;
}

export interface Client {
  id: string;
  name: string;
  src: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export interface ClientsData {
  headerText: string;
  clients: Client[];
  testimonials: Testimonial[];
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface TrustData {
  title: string;
  stats: Stat[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  mins: number;
  date: string;
  image: string;
  images?: string[];
  category: string;
  content?: string;
}

export interface BlogsData {
  popularPosts: BlogPost[];
  newestPosts: BlogPost[];
}

export interface ServiceSlide {
  headline: string;
  subheadline: string;
  description: string;
  services: string[];
}

export interface ServicesData {
  introTitle: string;
  introSubtitle: string;
  branding: ServiceSlide;
  technology: ServiceSlide;
  experience: ServiceSlide;
}

export interface CaseStudy {
  id?: string;
  slug: string;
  title: string;
  category: string;
  heroQuote: string;
  heroImage: string;
  introduction: string;
  sections: {
    title: string;
    content: string;
  }[];
  location?: string;
  featured?: boolean;
}

export interface CaseStudiesData {
  cases: CaseStudy[];
}

export interface SectionConfig {
  id: string;
  label: string;
  enabled: boolean;
}

export interface SectionsConfig {
  sections: SectionConfig[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  image: string;
  description: string | string[];
  tryUrl: string;
  featured?: boolean;
  available?: boolean;
}

export interface ProductsData {
  products: Product[];
}
