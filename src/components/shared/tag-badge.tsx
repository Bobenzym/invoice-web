import Link from 'next/link'

import { Badge } from '@/components/ui/badge'

interface TagBadgeProps {
  tag: string
  href?: string
}

export function TagBadge({ tag, href }: TagBadgeProps) {
  const content = <Badge variant="secondary">{tag}</Badge>

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
