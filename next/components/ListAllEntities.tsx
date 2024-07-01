import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { BoxLayout } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { FamilyListing } from '../@/components/component/family-listing'
import { PersonListing } from '../@/components/component/person-listing'
import { UsersIcon, HomeIcon } from '../@/components/ui/icon'
import { HouseListing } from '../@/components/component/house-listing'

export default function ListAllEntities({ queryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BoxLayout left={
        <div>
          <ListAllFamilies />
          <br />
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
    <div>
      <Container>
        <h2 className="p-6 text-4xl">Families</h2>
        <p>Loading...</p>
      </Container>
    </div>
  )
  if (error) return <div>Failed to load</div>

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
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">Houses</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

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
    <div>
      <h2 className="text-2xl leading-snug my-4 mx-0">People</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  console.log(data)

  return (
    <Container>
      <PersonListing personData={data} />
    </Container>
  )
}
