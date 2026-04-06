import Link from 'next/link'

import { Badge } from '@/components/ui/badge'

interface CategoryBadgeProps {
  category: string
  href?: string
}

export function CategoryBadge({ category, href }: CategoryBadgeProps) {
  const content = <Badge variant="default">{category}</Badge>

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
