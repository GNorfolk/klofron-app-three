export function Container({ children } : { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
      <main>{children}</main>
    </div>
  )
}