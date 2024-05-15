import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ManagePersonProposals({ personData, queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['managePersonProposalsData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
          (res) => res.json(),
        ),
    })

    const acceptProposal = useMutation({
      mutationFn: (person_id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/accept-proposal', {
          proposer_id: person_id,
          accepter_id: router.query.id
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

    const proposals = data.filter(prop =>
      prop.proposal_person.person_family_id != personData.person_family_id
    )

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <ul className={styles.list}>
          {proposals.map(({ proposal_id, proposal_person_id, proposal_person }) => (
            <li className={styles.listItem} key={proposal_id}>
              { personData.person_family.family_user_id === userId ?
              <div>
                <Link href={"/person/" + proposal_person_id}>{proposal_person.person_name + " " + proposal_person.person_family.family_name + ": "}</Link>
                <button onClick={
                  () => {
                    acceptProposal.mutate(proposal_person_id, {
                      onSettled: (res) => {
                        queryClient.invalidateQueries()
                      }
                    })
                  }
                }>Accept Proposal</button>
              </div> : <Link href={"/person/" + proposal_person_id}>{proposal_person.person_name + " " + proposal_person.person_family.family_name + "."}</Link>
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }
}