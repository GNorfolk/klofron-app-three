import Link from 'next/link'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { GrayButton } from "@/components/ui/button"
import { BoxLayout } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { HouseInfo } from '@/components/component/house'
import { PersonListing } from '@/components/component/person'
import { HeaderTwo } from '@/components/ui/header'
import { ListItem, Paragraph, Small } from '@/components/ui/text'

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeHouse queryClient={client} userId={userId} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function DescribeHouse({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseDatav2' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    const house_id = data.house_id

    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayout left={
          <div>
            <ListHouseInfo data={data} />
            {
              userId === data.house_family.family_user_id ?
              <div>
                <CreatePerson houseId={house_id} queryClient={queryClient} />
                <ListHousePeople peopleData={data.house_people} queryClient={queryClient} userId={userId} router={router} />
              </div>
              :
              <div>
                <ListHousePeople peopleData={data.house_people} queryClient={queryClient} router={router} />
              </div>
            }
          </div>
        } right={
          <div>
            <ListHouseTrades data={data.house_trades} router={router} />
            <ListHouseResources data={data} queryClient={queryClient} userId={userId} router={router} />
          </div>
        } />
      </QueryClientProvider>
    )
  }
}

function ListHousePeople({ peopleData, queryClient, userId = null, router }) {
  if (router.isReady) {
    if (peopleData.length > 0) {
      return (
        <Container>
          <PersonListing personData={peopleData} queryClient={queryClient} userId={userId} />
        </Container>
      )
    } else {
      return (
        <Container>
          <HeaderTwo>Person Info</HeaderTwo>
          <ul className="list-none p-0 m-0">
              <ListItem>
                <p>This house does not contain any people.</p>
              </ListItem>
          </ul>
        </Container>
      )
    }
  }
}

function ListHouseResources({ data, queryClient, userId = null, router }) {
  if (router.isReady) {
    return (
      <Container>
        <HeaderTwo>Resource Info</HeaderTwo>
        <Paragraph>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name + " has " + data.house_food.resource_volume + " food and " + data.house_wood.resource_volume + " wood in storage!"}</Paragraph>
        { userId === data.house_family.family_user_id ? <GrayButton
          onClick={ () => router.push(`/house/${router.query.id}/resource`) }
          text="Go to Resource Management page."
        /> : null }
      </Container>
    )
  }
}

function ListHouseTrades({ data, router }) {
  if (router.isReady) {
    if (data.length > 0) {
      return (
        <Container>
          <HeaderTwo>Trade Info</HeaderTwo>
          <ul className="list-none p-0 m-0">
            {data.map(({ trade_id, trade_offered_type, trade_offered_volume, trade_requested_type, trade_requested_volume }) => (
              <ListItem key={trade_id}>
                <p>Trade with id {trade_id} offers {trade_offered_volume} {trade_offered_type} in return for {trade_requested_volume} {trade_requested_type}.</p>
              </ListItem>
            ))}
          </ul>
        </Container>
      )
    } else {
      return (
        <Container>
          <HeaderTwo>Trade Info</HeaderTwo>
          <ul className="list-none p-0 m-0">
            <ListItem>
              <Paragraph>No trades active at this house.</Paragraph>
            </ListItem>
          </ul>
        </Container>
      )
    }
  }
}

function CreatePerson({ houseId, queryClient }) {
  const createPerson = useMutation({
    mutationFn: (house_id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + house_id)
    },
  })

  return (
    <Container>
      <GrayButton
        text="Create Person"
        onClick={ () => {
          createPerson.mutate(houseId, { onSettled: (data, error: any) => {
            queryClient.invalidateQueries()
            if (error) {
              document.getElementById("cm-two-" + houseId).innerText = error.response.data.message
            } else {
              document.getElementById("cm-two-" + houseId).innerText = ' '
            }
          }})
        }}
      />
      <Small uid={'two-' + houseId}></Small>
    </Container>
  )
}

function ListHouseInfo({ data }) {
  return (
    <Container>
      <HeaderTwo>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name}</HeaderTwo>
      <HouseInfo houseData={data} />
      {/* <p className="mt-0 mx-0 mb-5">has {data.house_rooms} rooms and contains {data.house_people.length} people, so has room for {data.house_rooms - data.house_people.length} more people.</p> */}
      {/* THIS IS COMMENTED OUT BECAUSE TRADES AREN'T SUPER IMPLEMENTED RIGHT NOW. TODO: Setup handling of trades here. */}
      {/* <p className="mt-0 mx-0 mb-5">{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage, and {data.house_food_in_trade} food and {data.house_wood_in_trade} wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food - data.house_wood - data.house_food_in_trade - data.house_wood_in_trade} space for more items.</p> */}
      {/* <p className="mt-0 mx-0 mb-5">{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage, and UNDEFINED food and UNDEFINED wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food.resource_volume - data.house_wood.resource_volume } space for more items.</p> */}
    </Container>
  )
}