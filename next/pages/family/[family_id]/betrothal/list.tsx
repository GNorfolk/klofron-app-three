import Link from 'next/link'
import { QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { BetrothalListing, BetrothalEligibleListing } from '@/components/component/betrothal'
import { HeaderTwo } from '@/components/ui/header'
import { Paragraph } from '@/components/ui/text'

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeFamilyBetrothals userId={userId} queryClient={client} router={router} />
      </QueryClientProvider>
    <div className="mt-12 mx-0 mb-0">
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}

export function DescribeFamilyBetrothals({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyBetrothalData' + router.query.family_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.family_id).then(
          (res) => res.json(),
        ),
    })
    
    if (isLoading) return (
      <BoxLayoutSingle>
        <Container>
          <HeaderTwo>Betrothal Info</HeaderTwo>
          <Paragraph>Loading...</Paragraph>
        </Container>
      </BoxLayoutSingle>
    )
    if (error) return (
      <BoxLayoutSingle>
        <Container>
          <HeaderTwo>Betrothal Info</HeaderTwo>
          <Paragraph>Failed to load!</Paragraph>
        </Container>
      </BoxLayoutSingle>
    )

    if (data.family_user_id === userId) {
      return (
        <BoxLayoutSingle>
          <Container>
            <BetrothalListing familyPeople={data.family_people} />
          </Container>
          <Container>
            <BetrothalEligibleListing familyPeople={data.family_people} />
          </Container>
        </BoxLayoutSingle>
      )
    } else {
      router.push('/')
    }
  }
}