import Link from 'next/link'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from 'components/component/base-layout'
import { BoxLayoutSingle } from 'components/component/box-layout'
import { Container } from 'components/component/container'
import { PersonListing } from 'components/component/person'
import { HeaderTwo } from 'components/ui/header'

export default function Main({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllPeople />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ListAllPeople() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listAllPeopleData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <HeaderTwo>People</HeaderTwo>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  console.log(data)

  return (
    <BoxLayoutSingle>
      <Container>
        <PersonListing personData={data} />
      </Container>
    </BoxLayoutSingle>
  )
}