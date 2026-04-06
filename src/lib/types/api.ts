import type { BlogPost, BlogPostSummary } from './blog-post'

// 공통 API 응답
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// 페이지네이션 정보
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  pageSize: number
  total: number
}

// 페이지네이션이 포함된 API 응답
export interface ApiPaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationInfo
}

// 포스트 목록 응답
export type PostListResponse = ApiPaginatedResponse<BlogPostSummary>

// 포스트 상세 응답
export type PostDetailResponse = ApiResponse<BlogPost>

// 포스트 검색 응답
export type PostSearchResponse = ApiPaginatedResponse<BlogPostSummary>
