import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import ListHousePeople from './ListHousePeople'
import ListHouseTrades from './ListHouseTrades'
import ListHouseResources from './ListHouseResources'
import axios from 'axios'
import { FormEventHandler, useState } from "react"

const queryClient = new QueryClient()

export default function DescribeHouseV2() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseDatav2' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const [houseInfo, sethouseInfo] = useState({ name: "" })
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/rename-house/' + router.query.id, {
        name: houseInfo.name
      }).then((value) => {
        queryClient.invalidateQueries()
      })
    };

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <h1 className={styles.heading2Xl}>{data.name}</h1>
        <p className={styles.listItem}>{data.name} has {data.rooms} rooms and contains {data.people} people, so has room for {data.rooms - data.people} more people.</p>
        <p className={styles.listItem}>{data.name} has {data.food} food and {data.wood} wood in storage, and {data.food_in_trade} food and {data.wood_in_trade} wood in trade. It can hold {data.storage} items so has {data.storage - data.food - data.wood - data.food_in_trade - data.wood_in_trade} space for more items.</p>
        <ListHousePeople />
        <ListHouseTrades />
        <ListHouseResources />
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
      </QueryClientProvider>
    )
  }
}