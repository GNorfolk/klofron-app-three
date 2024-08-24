import { useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { PersonListing } from '../@/components/component/person'

export default function ListAllPeople() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listAllPeopleData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0 text-gray-200">People</h2>
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