import Link from 'next/link'
import { BaseLayout } from '../@/components/component/base-layout'
import styles from '../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Router from "next/router"
import { useEffect } from "react"
import ListAllFamilies from '../components/ListAllFamilies'

let userId

export default function Family({ client }) {
  const { status, data } = useSession()
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/family")
  }, [status])
  if (status === "authenticated") {
    userId = data.user.id
    return (
      <BaseLayout>
        <QueryClientProvider client={client}>
          <ListAllFamilies queryClient={client} userId={userId}/>
        </QueryClientProvider>
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      </BaseLayout>
    )
  }
  return <div>Loading...</div>
}
