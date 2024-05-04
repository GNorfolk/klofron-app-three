import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'

export default function ListHouseResources({ queryClient, userId = null }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['resourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>{data.house_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage!</p>
        { userId === data.house_family.family_user_id ? <p>Go to <Link href={`/house/${router.query.id}/resource`}>Resource Management</Link> page.</p> : null }
      </div>
    )
  }
}