import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ListFamilyTravel() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyTravelData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>


    return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Go to <Link href={`/family/${router.query.id}/travel`}>Travel Management</Link> page.</p>
      </div>
    )
  }
}