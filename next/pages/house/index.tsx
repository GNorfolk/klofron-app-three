import Link from 'next/link'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from 'components/component/base-layout'
import { BoxLayoutSingle } from 'components/component/box-layout'
import { Container } from 'components/component/container'
import { HouseListing } from 'components/component/house'
import { HeaderTwo } from 'components/ui/header'

export default function Main({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllHouses />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ListAllHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <HeaderTwo>Houses</HeaderTwo>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <BoxLayoutSingle>
      <Container>
        <HouseListing houseData={data} />
      </Container>
    </BoxLayoutSingle>
  )
}