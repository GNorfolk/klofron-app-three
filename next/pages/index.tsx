import Link from 'next/link'
import Layout from '../components/Layout'
import styles from '../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Router from "next/router"
import { useEffect } from "react"
import ListAllFamilies from '../components/ListAllFamilies'

const queryClient = new QueryClient()
let userId

export default function Family() {
  const { status, data } = useSession()
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/family")
  }, [status])
  if (status === "authenticated") {
    userId = data.user.id
    return (
      <Layout>
        <QueryClientProvider client={queryClient}>
          <ListAllFamilies queryClient={queryClient} userId={userId}/>
        </QueryClientProvider>
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      </Layout>
    )
  }
  return <div>Loading...</div>
}
