// File: src/types/index.ts

// Strapi通用响应类型
export interface StrapiResponseMeta {
  pagination?: {
    page?: number;
    pageSize?: number;
    pageCount?: number;
    total?: number;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta?: StrapiResponseMeta;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Media类型
export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  url: string;
  previewUrl?: string;
  provider?: string;
  provider_metadata?: any;
  size?: number;
  mime?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface MediaFormat {
  name: string;
  hash?: string;
  ext?: string;
  mime?: string;
  width?: number;
  height?: number;
  size?: number;
  path?: string;
  url: string;
}

// Site Config类型
export interface SiteConfig {
  id: number;
  documentId: string;
  lab_name_main: string;
  lab_name_sub?: string;
  contact_address: string;
  contact_postcode: string;
  contact_phone: string;
  contact_email: string;
  map_embed?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

// Lab Intro类型
export interface LabIntro {
  id: number;
  documentId: string;
  title: string;
  summary: any; // Rich text JSON
  research_directions: any; // Rich text JSON
  achievements: any; // Rich text JSON
  environment_photos?: Media[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

// Team Member类型
export interface TeamMember {
  id: number;
  documentId: string;
  name: string;
  title: string;
  role_type: 'professor' | 'postdoc' | 'phd' | 'master' | 'undergrad' | 'alumni';
  email: string;
  homepage?: string;
  order: number;
  avatar?: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

// News Category类型
export interface NewsCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

// News类型
export interface News {
  id: number;
  documentId: string;
  title: string;
  summary: any; // Rich text JSON
  content: any; // Rich text JSON
  publishedAt: string;
  cover?: Media;
  news_category?: NewsCategory;
  createdAt: string;
  updatedAt: string;
  locale: string;
}

// Research Project类型
export interface ResearchProject {
  id: number;
  documentId: string;
  title: string;
  summary: any; // Rich text JSON
  project_status: 'ongoing' | 'completed';
  start_date: string;
  end_date?: string;
  team_members?: TeamMember[];
  cover?: Media;
  attachments?: Media[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

// Research Output类型
export interface ResearchOutput {
  id: number;
  documentId: string;
  title: string;
  type: 'paper' | 'patent' | 'award' | 'software' | 'other';
  year: number;
  authors: string;
  journal_or_conference?: string;
  abstract?: any; // Rich text JSON
  doi_or_link?: string;
  attachments?: Media[];
  cover?: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

// Carousel类型（如果需要）
export interface Carousel {
  id: number;
  attributes: {
    title: string;
    image?: {
      data: Media;
    };
    link?: string;
    createdAt: string;
    updatedAt: string;
  };
}

// API查询参数类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface NewsListParams extends PaginationParams {
  locale: string;
  categorySlug?: string;
  keyword?: string;
}

export interface TeamMembersParams extends PaginationParams {
  locale: string;
}