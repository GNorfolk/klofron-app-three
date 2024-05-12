import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'

export default function ManageFamilyProposals({ queryClient, userId }) {
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
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <div>
          <h2 className={styles.headingLg}>Proposal Info</h2>
          <p>Add info here.</p>
          <h2 className={styles.headingLg}>Manage Proposals</h2>
          <p>Add info here too.</p>
        </div>
      )
    } else {
      router.push('/')
    }
  }
}