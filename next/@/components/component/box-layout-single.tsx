export function BoxLayoutSingle({ children } : { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <main>{children}</main>
    </div>
  )
}