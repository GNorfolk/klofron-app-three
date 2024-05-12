import Link from 'next/link'
import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'

export default function ManageFamilyProposals({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyProposalData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      proposal_person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal', {
        person_id: formData.proposal_person_id
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + router.query.id).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + router.query.id).innerText = error.response.data.message
      })
    }

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    const familyBachelors = data.family_people.filter(ppl => ppl.person_proposals.length === 0 && ppl.person_age >= 18 && ppl.person_partner_id === null)
    const familyProposals = data.family_people.filter(ppl => ppl.person_proposals.length > 0)

    if (data.family_user_id === userId) {
      return (
        <div>
          <h2 className={styles.headingLg}>Proposal Info</h2>
          {
            familyProposals.length > 0 ?
              familyProposals.map(({ person_name, person_proposals }) => (
                <div>
                  <p>{person_name} has proposal <Link href={"/proposal/" + person_proposals[0].proposal_id}>{person_proposals[0].proposal_id}</Link></p>
                </div>
              ))
            :
              <p>No proposals!</p>
          }
          <h2 className={styles.headingLg}>Manage Proposals</h2>
          {
            familyBachelors.length > 0 ?
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <select {...register("proposal_person_id", { required: true })}>
                    { errors.proposal_person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null }
                    {
                      data.family_people.map(({ person_id, person_name }) => (
                        <option value={person_id}>{person_name}</option>
                      ))
                    }
                  </select>
                  <input type="submit" />
                </form>
                <small className={styles.lightText} id={'cm-' + router.query.id}></small>
              </div>
            :
              <p>No eligible bachelors!</p>
          }
        </div>
      )
    } else {
      router.push('/')
    }
  }
}