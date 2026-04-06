import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 문자열로 포맷
 * @param date 날짜 객체
 * @param locale 로캘 (기본값: 'ko-KR')
 * @returns 포맷된 날짜 문자열
 */
export function formatDate(date: Date, locale = 'ko-KR'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 읽기 시간 계산 (평균 200자/분)
 * @param text 텍스트 내용
 * @returns 읽기 시간 (분)
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const textLength = text.length
  return Math.max(1, Math.ceil(textLength / wordsPerMinute))
}

/**
 * 텍스트를 지정된 길이로 잘라내기
 * @param text 원본 텍스트
 * @param length 최대 길이
 * @param suffix 말미 문자 (기본값: '...')
 * @returns 잘린 텍스트
 */
export function truncateText(
  text: string,
  length: number,
  suffix = '...'
): string {
  if (text.length <= length) return text
  return text.slice(0, length) + suffix
}

/**
 * 텍스트를 URL-safe slug로 변환
 * @param text 원본 텍스트
 * @returns slug 문자열
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_]+/g, '-') // 공백과 언더스코어를 하이픈으로
    .replace(/^-+|-+$/g, '') // 시작과 끝의 하이픈 제거
}
