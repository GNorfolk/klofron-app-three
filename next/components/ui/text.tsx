export function Paragraph({ children } : { children: string }) {
  return (
    <p className="mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">{children}</p>
  )
}

export function Small({ children, uid } : { children?: React.ReactNode, uid: string | number }) {
  return (
    <small className="text-gray-500" id={"cm-" + String(uid)}>{children}</small>
  )
}

export function ListItem({ children, key } : { children: React.ReactNode, key?: string }) {
  return (
    <li className="mt-0 mx-0 mb-5" key={key}>
      {children}
    </li>
  )
}