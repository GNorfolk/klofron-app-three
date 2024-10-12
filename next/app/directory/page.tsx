import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BoxLayout } from '@/components/component/box-layout'
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
        <ListAllEntities queryClient={client} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ListAllEntities({ queryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BoxLayout left={
        <div>
          <ListAllFamilies />
          <ListAllHouses />
        </div>
      } right={
        <ListAllPeople />
      }/>
    </QueryClientProvider>
  )
}

function ListAllFamilies({ queryClient = null, userId = null }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
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

function ListAllHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <Container>
      <HeaderTwo>Houses</HeaderTwo>
      <Paragraph>Loading...</Paragraph>
    </Container>
  )
  if (error) return (
    <Container>
      <HeaderTwo>Houses</HeaderTwo>
      <Paragraph>Failed to load!</Paragraph>
    </Container>
  )

  return (
    <Container>
      <HouseListing houseData={data} />
    </Container>
  )
}

function ListAllPeople() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listAllPeopleData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <Container>
      <HeaderTwo>People</HeaderTwo>
      <Paragraph>Loading...</Paragraph>
    </Container>
  )
  if (error) return (
    <Container>
      <HeaderTwo>People</HeaderTwo>
      <Paragraph>Failed to load!</Paragraph>
    </Container>
  )

  return (
    <Container>
      <PersonListing personData={data} />
    </Container>
  )
}
