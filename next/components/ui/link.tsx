import Link from 'next/link'

export function StyledLink({ children, href } : { children: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="p-6 pt-2 pb-2">
      {children}
    </Link>
  )
}