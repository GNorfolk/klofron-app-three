import Layout from '../components/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Router from "next/router"
import { useEffect } from "react"
import DescribeFamily from '../components/DescribeFamily'

const queryClient = new QueryClient()
let familyId

export default function Family() {
  const { status, data } = useSession()
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/family")
  }, [status])
  if (status === "authenticated") {
    familyId = 2
    return (
      <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribeFamily queryClient={queryClient} familyId={familyId}/>
      </QueryClientProvider>
    </Layout>
    )
  }
  return <div>Loading...</div>
}
