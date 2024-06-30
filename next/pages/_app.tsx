import '../styles/globals.css'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} key={router.asPath} client={queryClient} />
    </SessionProvider>
  )
}