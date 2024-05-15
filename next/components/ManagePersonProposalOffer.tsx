import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ManagePersonProposalOffer({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['ManagePersonProposalOfferData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal/' + router.query.idd).then(
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

    // const proposals = data.filter(prop =>
    //   prop.proposal_person.person_family_id != personData.person_family_id
    // )

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Here will be some info on accepting proposals.</p>
      </div>
    )
  }
}