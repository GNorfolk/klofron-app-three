export function Paragraph({ children } : { children: string }) {
  return (
    <p className="mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">{children}</p>
  )
}

export function Small({ children = null, uid } : { children: string | null, uid: string | number }) {
  return (
    <small className="text-gray-500" id={"cm-" + String(uid)}>{children}</small>
  )
}
