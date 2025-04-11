import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery, QueryClient } from '@tanstack/react-query'
import { BoxLayout } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { FamilyListing } from '@/components/component/family'
import { PersonListing } from '@/components/component/person'
import { HouseListing } from '@/components/component/house'
import { HeaderOne, HeaderTwo } from '@/components/ui/header'
import { Paragraph } from '@/components/ui/text'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'


export default function Main({ client, router, familiesData, housesData, peopleData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <BoxLayout left={
          <div>
            <ListAllFamilies familiesData={familiesData} />
            <ListAllHouses housesData={housesData} />
          </div>
        } right={
          <ListAllPeople peopleData={peopleData} />
        }/>
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

function ListAllFamilies({ familiesData }) {
  if (!familiesData)
    return (
      <Container>
        <HeaderOne>Families</HeaderOne>
        <Paragraph>Failed to load!</Paragraph>
      </Container>
    )

  return (
    <Container>
      <FamilyListing familyData={familiesData} />
    </Container>
  )
}

function ListAllHouses({ housesData }) {
  if (!housesData)
    return (
      <Container>
        <HeaderOne>Houses</HeaderOne>
        <Paragraph>Failed to load!</Paragraph>
      </Container>
    )

  return (
    <Container>
      <HouseListing houseData={housesData} />
    </Container>
  )
}

function ListAllPeople({ peopleData }) {
  if (!peopleData)
    return (
      <Container>
        <HeaderOne>People</HeaderOne>
        <Paragraph>Failed to load!</Paragraph>
      </Container>
    )

  return (
    <Container>
      <PersonListing personData={peopleData} />
    </Container>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resFamily = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v2/family`)
    const resHouse = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v2/house`)
    const resPerson = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v2/person`)

    const familiesData = await resFamily.json()
    const housesData = await resHouse.json()
    const peopleData = await resPerson.json()

    return {
      props: {
        familiesData,
        housesData,
        peopleData,
      },
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return {
      props: {
        familiesData: null,
        housesData: null,
        peopleData: null,
      },
    }
  }
}
