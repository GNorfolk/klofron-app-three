import Link from 'next/link'
import { BaseLayout } from '@/components/component/base-layout'
import { QueryClientProvider, useQuery, QueryClient } from '@tanstack/react-query'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { FamilyListing } from '@/components/component/family'
import { PersonListing } from '@/components/component/person'
import { HouseListing } from '@/components/component/house'
import { HeaderOne, HeaderTwo } from '@/components/ui/header'
import { Paragraph } from '@/components/ui/text'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'


export default function Main({ client, router, familiesData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <BoxLayoutSingle>
          <ListAllFamilies familiesData={familiesData} />
        </BoxLayoutSingle>
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v2/family`)
    const familiesData = await res.json()

    return {
      props: {
        familiesData,
      },
    }
  } catch (error) {
    console.error('Failed to fetch families data:', error)
    return {
      props: {
        familiesData: null,
      },
    }
  }
}
