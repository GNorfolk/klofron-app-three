import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { FamilyListing } from '@/components/component/family'
import { PersonListing } from '@/components/component/person'
import { HouseListing } from '@/components/component/house'
import { HeaderOne, HeaderTwo } from '@/components/ui/header'
import { Paragraph } from '@/components/ui/text'

export default function Main({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <BoxLayoutSingle>
          <ListAllFamilies />
        </BoxLayoutSingle>
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

function ListAllFamilies({ queryClient = null, userId = null }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['directoryFamiliesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <Container>
      <HeaderOne>Families</HeaderOne>
      <Paragraph>Loading...</Paragraph>
    </Container>
  )
  if (error) return (
    <Container>
      <HeaderOne>Families</HeaderOne>
      <Paragraph>Failed to load!</Paragraph>
    </Container>
  )

  return (
    <Container>
      <FamilyListing familyData={data} />
    </Container>
  )
}
