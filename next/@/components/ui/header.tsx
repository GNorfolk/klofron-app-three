export function HeaderOne({ children } : { children: string }) {
  return (
    <h1 className="p-6 text-4xl text-gray-200">{children}</h1>
  )
}

export function HeaderTwo({ children } : { children: string }) {
  return (
    <h2 className="text-2xl leading-snug my-4 mx-0 text-gray-200">{children}</h2>
  )
}

export function HeaderThree({ children } : { children: string })  {
  return (
    <h3 className="text-xl font-semibold text-gray-200">{children}</h3>
  )
}
