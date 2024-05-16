import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListPersonProposals({ data, showLink = true }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <ul className={styles.list}>
          {
            data.person_proposals.length > 0 ?
              data.person_proposals.map(({ proposal_id }) => (
                <li className={styles.listItem} key={proposal_id}>
                  <p>{data.person_name} has an existing proposal with id {proposal_id}.</p>
                </li>
              ))
            :
              <p>{data.person_name} is not open to proposal offers!</p>
          }
        </ul>
        {
          showLink ? <p>Go to <Link href={`/person/${router.query.id}/proposal`}>Proposals</Link> page.</p> : null
        }
      </div>
    )
  }
}