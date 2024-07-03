export function Container({ children } : { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 border-gray-200 border-2 rounded-lg shadow-md p-6 dark:bg-gray-800 my-6">
      <main>{children}</main>
    </div>
  )
}