import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'

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

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>{data.name}</h2>
        <p className={styles.listItem}>{data.name} has {data.rooms} rooms and contains {data.people} people, so has room for {data.rooms - data.people} more people.</p>
        <p className={styles.listItem}>{data.name} has {data.food} food and {data.wood} wood in storage, and {data.food_in_trade} food and {data.wood_in_trade} wood in trade. It can hold {data.storage} items so has {data.storage - data.food - data.wood - data.food_in_trade - data.wood_in_trade} space for more items.</p>
      </div>
    )
  }
}