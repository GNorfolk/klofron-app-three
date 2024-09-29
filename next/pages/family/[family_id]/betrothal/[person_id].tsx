import Link from 'next/link'
import { useQuery, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import { BoxLayout } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { BetrothalCreation } from '@/components/component/betrothal'
import { PersonInfo } from '@/components/component/person'
import { HeaderTwo } from '@/components/ui/header'

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <CreateBetrothal userId={userId} queryClient={client} router={router} />
      </QueryClientProvider>
    <div className="mt-12 mx-0 mb-0">
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}

export function CreateBetrothal({ queryClient, userId, router }) {
  if (router.isReady) {
    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayout left={
          <CreateBetrothalInfo personId={router.query.person_id} />
        } right={
          <CreateBetrothalForm familyId={router.query.family_id} personId={router.query.person_id} queryClient={queryClient} />
        } />
      </QueryClientProvider>
    )
  }
}

export function CreateBetrothalInfo({ personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['CreateBetrothalInfoData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + personId).then(
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
    <Container>
      <PersonInfo title="Betrothal" personInfo={data} />
    </Container>
  )
}

export function CreateBetrothalForm({ familyId, personId, queryClient }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['CreateBetrothalFormData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + familyId).then(
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
    <Container>
      <BetrothalCreation peopleData={data.family_people} familyId={familyId} personId={personId} queryClient={queryClient} familyName={data.family_name} />
    </Container>
  )
}