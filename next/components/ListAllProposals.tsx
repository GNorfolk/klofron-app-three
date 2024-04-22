import styles from '../styles/main.module.css'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ListAllProposals({ accepterPersonId = null, queryClient = null }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['listProposalsData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
        (res) => res.json(),
      ),
  })

  const acceptProposal = useMutation({
    mutationFn: (proposer_person_id) => {
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/accept-proposal', {
        proposer_id: proposer_person_id,
        accepter_id: accepterPersonId
      })
    },
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
        {data.map(({ proposal_id, proposal_proposer_person_id, proposal_proposer_person }) => (
          <li className={styles.listItem} key={proposal_id}>
            { queryClient || accepterPersonId ? 
            <>
              <Link href={"/person/" + proposal_proposer_person_id}>{proposal_proposer_person.person_name + " " + proposal_proposer_person.person_family.family_name + ": "}</Link>
              <button onClick={
                () => {
                  acceptProposal.mutate(proposal_proposer_person_id, {
                    onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }
                  })
                }
              }>Accept Proposal</button>
            </> : <Link href={"/person/" + proposal_proposer_person_id}>{proposal_proposer_person.person_name + " " + proposal_proposer_person.person_family.family_name + "."}</Link>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}