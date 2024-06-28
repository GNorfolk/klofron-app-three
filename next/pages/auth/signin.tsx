import { BaseLayout } from '../../@/components/component/base-layout'
import { Login } from '../../@/components/component/login'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getCsrfToken } from "next-auth/react"
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function LogIn({ client }) {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['familyData'],
  //   queryFn: () =>
  //     fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/').then(
  //       (res) => res.json(),
  //     ),
  // })

  return (
    <BaseLayout>
      <QueryClientProvider client={queryClient}>
        <Login csrfToken="somestring" />
      </QueryClientProvider>
    </BaseLayout>
  )
}
