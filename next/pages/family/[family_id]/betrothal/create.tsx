import Link from 'next/link'
import { QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { BetrothalCreationListing } from '@/components/component/betrothal'
import { HeaderTwo } from '@/components/ui/header'

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <CreateFamilyBetrothals userId={userId} queryClient={client} router={router} />
      </QueryClientProvider>
    <div className="mt-12 mx-0 mb-0">
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}

export function CreateFamilyBetrothals({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['createFamilyBetrothalsData' + router.query.family_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person').then(
          (res) => res.json(),
        ),
    })
    
    if (isLoading) return (
      <div>
        <HeaderTwo>Betrothal Info</HeaderTwo>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <BoxLayoutSingle>
        <Container>
          <BetrothalCreationListing peopleData={data} familyId={router.query.family_id} />
        </Container>
      </BoxLayoutSingle>
    )

  }
}