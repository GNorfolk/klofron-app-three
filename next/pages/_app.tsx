import '../styles/globals.css'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} key={router.asPath} />
    </SessionProvider>
  )
}