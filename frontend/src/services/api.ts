// File: src/services/api.ts

import http from './http';
import type {
  SiteConfig,
  LabIntro,
  TeamMember,
  News,
  NewsCategory,
  ResearchProject,
  ResearchOutput,
  Carousel,
  NewsListParams,
  TeamMembersParams,
  StrapiSingleResponse,
  StrapiCollectionResponse
} from '@/types';

// ========== 站点配置相关 API ==========
export const getSiteConfig = (locale: string): Promise<StrapiSingleResponse<SiteConfig>> => {
  return http.get(`/api/site-config?locale=${locale}&populate=*`);
};

// ========== 实验室简介相关 API ==========
export const getLabIntro = (locale: string): Promise<StrapiSingleResponse<LabIntro>> => {
  return http.get(`/api/lab-intro?locale=${locale}&populate=environment_photos`);
};

// ========== 团队成员相关 API ==========
export const getTeamMembers = (params: TeamMembersParams): Promise<StrapiCollectionResponse<TeamMember>> => {
  const { locale, page = 1, pageSize = 200 } = params;
  return http.get(
    `/api/team-members?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=order:asc&populate=avatar`
  );
};

// ========== 新闻分类相关 API ==========
export const getNewsCategories = (locale: string): Promise<StrapiCollectionResponse<NewsCategory>> => {
  return http.get(`/api/news-categories?locale=${locale}`);
};

// ========== 新闻相关 API ==========
export const getNewsList = (params: NewsListParams): Promise<StrapiCollectionResponse<News>> => {
  const { locale, page = 1, pageSize = 10, categorySlug, keyword } = params;

  let query = `/api/news-items?locale=${locale}&populate=cover&populate=news_category&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  if (categorySlug) {
    query += `&filters[news_category][slug][$eq]=${categorySlug}`;
  }

  if (keyword) {
    query += `&filters[title][$containsi]=${keyword}`;
  }

  return http.get(query);
};

export const getNewsDetail = (id: number, locale: string): Promise<StrapiSingleResponse<News>> => {
  return http.get(`/api/news-items/${id}?locale=${locale}&populate=cover&populate=news_category&populate=attachments`);
};

// ========== 科研项目相关 API ==========
export const getResearchProjects = (locale: string): Promise<StrapiCollectionResponse<ResearchProject>> => {
  return http.get(
    `/api/research-projects?locale=${locale}&populate=team_members&populate=cover&sort=start_date:desc`
  );
};

// ========== 科研成果相关 API ==========
export const getResearchOutputs = (locale: string): Promise<StrapiCollectionResponse<ResearchOutput>> => {
  return http.get(`/api/research-outputs?locale=${locale}&sort[0]=year:desc`);
};

// ========== 轮播图相关 API ==========
export const getCarousels = (locale: string): Promise<StrapiCollectionResponse<Carousel>> => {
  return http.get(`/api/carousels?locale=${locale}&populate=image`);
};

// ========== 首页数据 API ==========
// 获取首页综合新闻（最新5条）
export const getHomeNews = (locale: string): Promise<StrapiCollectionResponse<News>> => {
  return http.get(
    `/api/news-items?locale=${locale}&populate=cover&populate=news_category&sort=publishedAt:desc&pagination[pageSize]=5`
  );
};

// 获取首页通知公告（category slug为notice）
export const getHomeNotices = (locale: string): Promise<StrapiCollectionResponse<News>> => {
  return http.get(
    `/api/news-items?locale=${locale}&populate=cover&populate=news_category&sort=publishedAt:desc&filters[news_category][slug][$eq]=notice&pagination[pageSize]=5`
  );
};

// 获取首页学术交流（category slug为academic）
export const getHomeAcademics = (locale: string): Promise<StrapiCollectionResponse<News>> => {
  return http.get(
    `/api/news-items?locale=${locale}&populate=cover&populate=news_category&sort=publishedAt:desc&filters[news_category][slug][$eq]=academic&pagination[pageSize]=5`
  );
};