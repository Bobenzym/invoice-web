import { z } from 'zod'

// Notion 블록 스키마
export const NotionBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
})

// 블로그 포스트 스키마
export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.array(NotionBlockSchema),
  tags: z.array(z.string()),
  category: z.string(),
  author: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'published']),
  readingTime: z.number(),
})

// 블로그 포스트 요약 스키마
export const BlogPostSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  author: z.string(),
  publishedAt: z.date(),
  coverImage: z.string().optional(),
  readingTime: z.number(),
})

// 페이지네이션 정보 스키마
export const PaginationInfoSchema = z.object({
  currentPage: z.number().positive(),
  totalPages: z.number().nonnegative(),
  pageSize: z.number().positive(),
  total: z.number().nonnegative(),
})

// 페이지네이션이 포함된 API 응답 스키마
export const ApiPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    pagination: PaginationInfoSchema,
  })

// 공통 API 응답 스키마
export const ApiResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: itemSchema,
    error: z.string().optional(),
  })

// 타입 추론
export type BlogPost = z.infer<typeof BlogPostSchema>
export type BlogPostSummary = z.infer<typeof BlogPostSummarySchema>
export type PaginationInfo = z.infer<typeof PaginationInfoSchema>
