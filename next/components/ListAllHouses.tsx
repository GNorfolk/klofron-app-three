import { useQuery } from '@tanstack/react-query'
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { HouseListing } from '../@/components/component/house'
import { HeaderTwo } from '../@/components/ui/header'

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