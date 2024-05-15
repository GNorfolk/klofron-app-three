import styles from '../styles/main.module.css'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListAllProposals() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listProposalsData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
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

  return (
    <div>
      <h2 className={styles.headingLg}>Proposal Info</h2>
      <ul className={styles.list}>
        {data.map(({ proposal_id, proposal_person_id, proposal_person }) => (
          <li className={styles.listItem} key={proposal_id}>
            <Link href={"/person/" + proposal_person_id}>{proposal_person.person_name + " " + proposal_person.person_family.family_name + "."}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}