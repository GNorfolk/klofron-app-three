export function Paragraph({ children } : { children: string }) {
  return (
    <p className="mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">{children}</p>
  )
}
