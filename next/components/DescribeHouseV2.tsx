import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import ListHousePeople from './ListHousePeople'
import ListHouseTrades from './ListHouseTrades'
import ListHouseResources from './ListHouseResources'
import axios from 'axios'
import { FormEventHandler, useState } from "react"

export default function DescribeHouseV2({ queryClient }) {
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
        <h1 className={styles.heading2Xl}>{data.house_name}</h1>
        <p className={styles.listItem}>{data.house_name} has {data.house_rooms} rooms and contains {data.house_people} people, so has room for {data.house_rooms - data.house_people} more people.</p>
        <p className={styles.listItem}>{data.house_name} has {data.house_food} food and {data.house_wood} wood in storage, and {data.house_food_in_trade} food and {data.house_wood_in_trade} wood in trade. It can hold {data.house_storage} items so has {data.house_storage - data.house_food - data.house_wood - data.house_food_in_trade - data.house_wood_in_trade} space for more items.</p>
        <button onClick={
          () => {
            createPerson.mutate(data.house_id, { onSettled: (res) => {
              queryClient.invalidateQueries()
              if (!res.data.success) {
                document.getElementById("change-me-two-" + data.house_id).innerText = res.data.error
              } else {
                document.getElementById("change-me-two-" + data.house_id).innerText = ' '
              }
            }})
          }
        } >Create Person</button>
        <small className={styles.lightText} id={'change-me-two-' + data.house_id}></small>
        <ListHousePeople queryClient={queryClient} />
        <ListHouseTrades />
        <ListHouseResources queryClient={queryClient} />
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