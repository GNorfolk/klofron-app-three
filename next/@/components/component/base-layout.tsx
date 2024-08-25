import Link from "next/link"
import { Button } from "../../components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "../../components/ui/sheet"
import { MountainIcon, HomeIcon, MicroscopeIcon, MenuIcon, LockIcon } from '../ui/icon'
import { signIn, signOut, useSession } from "next-auth/react"

export function BaseLayout({ children } : { children: React.ReactNode }) {
  const { status, data } = useSession()
  return (
    <div className="grid md:grid-cols-[200px_1fr] w-full min-h-screen">
      <div className="bg-gray-100 dark:bg-gray-800 hidden md:block">
        <div className="flex flex-col h-full bg-black">
          <div className="flex h-16 items-center px-6 border-b border-gray-700 dark:border-gray-700">
            <div className="flex items-center gap-2 font-semibold">
              <MountainIcon className="h-6 w-6" />
              <span className="text-gray-900 dark:text-gray-50">klofroN</span>
            </div>
          </div>
          <nav className="flex-1 py-4">
            <ul className="grid gap-1">
              <li className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                <Link href="/">
                  <section className="flex">
                    <HomeIcon className="w-5 h-5 min-w-5 min-h-5" />
                    <span className='ml-2'>Home</span>
                  </section>
                </Link>
              </li>
              <li className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                <Link href="/index">
                  <section className="flex">
                    <MicroscopeIcon className="w-5 h-5 min-w-5 min-h-5" />
                    <span className='ml-2'>Index</span>
                  </section>
                </Link>
              </li>
              { status === "authenticated" ? (
                <li>
                  <a onClick={(e) => { e.preventDefault(); signOut() }} className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                    <LockIcon className="w-5 h-5 min-w-5 min-h-5" />
                    <span className='whitespace-nowrap'>Logout</span>
                  </a>
                </li>
              ) : (
                <li>
                  <a onClick={(e) => { e.preventDefault(); signIn() }} className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                    <LockIcon className="w-5 h-5 min-w-5 min-h-5" />
                    <span className='whitespace-nowrap'>Login</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-black px-4 dark:border-gray-700 dark:bg-gray-950 md:hidden">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <MountainIcon className="h-6 w-6" />
            <span className="text-gray-500 dark:text-gray-50">klofroN</span>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <MenuIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black dark:bg-gray-950" side="left">
              <div className="flex h-16 items-center px-6 border-b border-gray-700 dark:border-gray-700">
                <div className="flex items-center gap-2 font-semibold">
                  <MountainIcon className="h-6 w-6" />
                  <span className="text-gray-500 dark:text-gray-50">klofroN</span>
                </div>
              </div>
              <nav className="flex-1 py-4">
                <ul className="grid gap-1">
                  <li className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                    <Link href="/">
                      <section className="flex">
                        <HomeIcon className="w-5 h-5 min-w-5 min-h-5" />
                        <span className='ml-2'>Home</span>
                      </section>
                    </Link>
                  </li>
                  <li className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                    <Link href="/index">
                      <section className="flex">
                        <MicroscopeIcon className="w-5 h-5 min-w-5 min-h-5" />
                        <span className='ml-2'>Index</span>
                      </section>
                    </Link>
                  </li>
                  { status === "authenticated" ? (
                    <li>
                      <a onClick={(e) => { e.preventDefault(); signOut() }} className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-900 hover:text-gray-400 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                        <LockIcon className="w-5 h-5 min-w-5 min-h-5" />
                        <span className='whitespace-nowrap'>Logout</span>
                      </a>
                    </li>
                  ) : (
                    <li>
                      <a onClick={(e) => { e.preventDefault(); signIn() }} className="flex items-center gap-3 px-6 py-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50">
                        <LockIcon className="w-5 h-5 min-w-5 min-h-5" />
                        <span className='whitespace-nowrap'>Login</span>
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-slate-900">
          <div className="prose prose-gray dark:prose-invert">
            <main>{children}</main>
          </div>
        </main>
      </div>
    </div>
  )
}
