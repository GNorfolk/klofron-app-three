import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'

export default function ManagePersonProposals({ userId, queryClient = null }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['listProposalsData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal').then(
          // ToDo: Do something different with this data set so we can compare userId, mebe get person data and proposal data somehow
          (res) => res.json(),
        ),
    })

    const acceptProposal = useMutation({
      mutationFn: (proposer_person_id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/accept-proposal', {
          proposer_id: proposer_person_id,
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

    const proposals = data.filter(prop => prop.proposal_id != 30)

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <ul className={styles.list}>
          {proposals.map(({ proposal_id, proposal_proposer_person_id, proposal_proposer_person }) => (
            <li className={styles.listItem} key={proposal_id}>
              {/* ToDo: Add something like data.house_family.family_user_id === userId conditional */}
              { queryClient ? 
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
}