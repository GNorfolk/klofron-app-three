import { useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { HouseListing } from '../@/components/component/house-listing'

export default function ListAllHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['housesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">Houses</h2>
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