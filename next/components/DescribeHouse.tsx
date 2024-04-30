import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import ListHousePeople from './ListHousePeople'
import ListHouseTrades from './ListHouseTrades'
import ListHouseResources from './ListHouseResources'
import axios from 'axios'
import { FormEventHandler, useState } from "react"

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

    const createPerson = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-person/' + id)
      },
    })

    const [houseInfo, sethouseInfo] = useState({ name: "" })
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id, {
        name: houseInfo.name
      }).then((value) => {
        queryClient.invalidateQueries()
      })
    };

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <h1 className={styles.heading2Xl}>{data.house_name}</h1>
        <p className={styles.listItem}>{data.house_name} has {data.house_rooms} rooms and contains {data.house_people.length} people, so has room for {data.house_rooms - data.house_people.length} more people.</p>
        {/* THIS IS COMMENTED OUT BECAUSE TRADES AREN'T SUPER IMPLEMENTED RIGHT NOW. TODO: Setup handling of trades here. */}
        {/* <p className={styles.listItem}>{data.house_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage, and {data.house_food_in_trade} food and {data.house_wood_in_trade} wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food - data.house_wood - data.house_food_in_trade - data.house_wood_in_trade} space for more items.</p> */}
        <p className={styles.listItem}>{data.house_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage, and UNDEFINED food and UNDEFINED wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food.resource_volume - data.house_wood.resource_volume } space for more items.</p>
        {
          userId === data.house_family.family_user_id ?
          <div>
            <button onClick={
              () => {
                createPerson.mutate(data.house_id, { onSettled: (res) => {
                  queryClient.invalidateQueries()
                  if (!res.data.success) {
                    document.getElementById("cm-two-" + data.house_id).innerText = res.data.error
                  } else {
                    document.getElementById("cm-two-" + data.house_id).innerText = ' '
                  }
                }})
              }
            } >Create Person</button>
            <small className={styles.lightText} id={'cm-two-' + data.house_id}></small>
            <ListHousePeople queryClient={queryClient} userId={userId} />
          </div>
          :
          <div>
            <ListHousePeople queryClient={queryClient} />
          </div>
        }
        <ListHouseTrades />
        <ListHouseResources queryClient={queryClient} userId={userId} />
        {
          userId === data.house_family.family_user_id ?
          <div>
            <h3 className={styles.headingMd}>Rename House</h3>
              <ul className={styles.list}>
                <form onSubmit={handleSubmit}>
                  <input
                    value={houseInfo.name}
                    onChange={({ target }) =>
                      sethouseInfo({ ...houseInfo, name: target.value })
                    }
                    placeholder="Insert name here"
                  />
                  <input type="submit" value="Rename" />
                </form>
              </ul>
          </div>
          :
          <></>
        }
      </QueryClientProvider>
    )
  }
}