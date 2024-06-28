import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { Button } from "../@/components/ui/button"
import { BoxLayout } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { HouseInfo } from '../@/components/component/house-info'
import { PersonListing } from '../@/components/component/person-listing'

export default function DescribeHouse({ queryClient, userId }) {
  const router = useRouter()
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
            <br />
            {
              userId === data.house_family.family_user_id ?
              <div>
                <CreatePerson houseId={house_id} queryClient={queryClient} />
                <br />
                <ListHousePeople peopleData={data.house_people} queryClient={queryClient} userId={userId} />
              </div>
              :
              <div>
                <ListHousePeople peopleData={data.house_people} queryClient={queryClient} />
              </div>
            }
          </div>
        } right={
          <div>
            <ListHouseTrades data={data.house_trades} />
            <br />
            <ListHouseResources data={data} queryClient={queryClient} userId={userId} />
          </div>
        } />
      </QueryClientProvider>
    )
  }
}

function ListHousePeople({ peopleData, queryClient, userId = null }) {
  const router = useRouter()
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
          <h2 className={styles.headingLg}>Person Info</h2>
          <ul className={styles.list}>
              <li className={styles.listItem}>
                <p>This house does not contain any people.</p>
              </li>
          </ul>
        </Container>
      )
    }
  }
}

function ListHouseResources({ data, queryClient, userId = null }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Container>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage!</p>
        { userId === data.house_family.family_user_id ? <p>Go to <Link href={`/house/${router.query.id}/resource`}>Resource Management</Link> page.</p> : null }
      </Container>
    )
  }
}

function ListHouseTrades({ data }) {
  const router = useRouter()
  if (router.isReady) {
    if (data.length > 0) {
      return (
        <Container>
          <h2 className={styles.headingLg}>Trade Info</h2>
          <ul className={styles.list}>
            {data.map(({ trade_id, trade_offered_type, trade_offered_volume, trade_requested_type, trade_requested_volume }) => (
              <li className={styles.listItem} key={trade_id}>
                <p>Trade with id {trade_id} offers {trade_offered_volume} {trade_offered_type} in return for {trade_requested_volume} {trade_requested_type}.</p>
              </li>
            ))}
          </ul>
        </Container>
      )
    } else {
      return (
        <Container>
          <h2 className={styles.headingLg}>Trade Info</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <p>No trades active at this house.</p>
            </li>
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
      <Button size="sm"
        variant="ghost"
        className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
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
      >Create Person</Button>
      <small className={styles.lightText} id={'cm-two-' + houseId}></small>
    </Container>
  )
}

function ListHouseInfo({ data }) {
  return (
    <Container>
      <h2 className={styles.headingLg}>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name}</h2>
      <HouseInfo houseData={data} />
      {/* <p className={styles.listItem}>has {data.house_rooms} rooms and contains {data.house_people.length} people, so has room for {data.house_rooms - data.house_people.length} more people.</p> */}
      {/* THIS IS COMMENTED OUT BECAUSE TRADES AREN'T SUPER IMPLEMENTED RIGHT NOW. TODO: Setup handling of trades here. */}
      {/* <p className={styles.listItem}>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage, and {data.house_food_in_trade} food and {data.house_wood_in_trade} wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food - data.house_wood - data.house_food_in_trade - data.house_wood_in_trade} space for more items.</p> */}
      {/* <p className={styles.listItem}>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage, and UNDEFINED food and UNDEFINED wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food.resource_volume - data.house_wood.resource_volume } space for more items.</p> */}
    </Container>
  )
}