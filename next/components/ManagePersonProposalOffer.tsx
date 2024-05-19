import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function ManagePersonProposalOffer({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const personId = router.query?.person_id ? router.query.person_id : null
    const proposalId = router.query?.proposal_id ? router.query.proposal_id : null

    const { isLoading, error, data } = useQuery({
      queryKey: ['ManagePersonProposalOfferData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + personId).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      proposal_offer_person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal-offer', {
        proposal_offer_person_id: personId,
        proposal_offer_proposal_id: proposalId,
        proposal_dowry_person_id: formData.proposal_offer_person_id
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + personId).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + personId).innerText = error.response.data.message
      })
    }

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Proposal Offer</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    const familyBachelors = data.person_family.family_people.filter(ppl =>
      ppl.person_age >= 18 && ppl.person_partner_id === null && ppl.person_id != personId
    )

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Offer</h2>
        {
          familyBachelors.length > 0 ?
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <select {...register("proposal_offer_person_id", { required: true })}>
                {
                  errors.proposal_offer_person_id ? document.getElementById("cm-" + personId).innerText = "The Person field is required" : null
                }
                {
                  familyBachelors.map(({ person_id, person_name }) => (
                    <option value={person_id}>{person_name}</option>
                  ))
                }
                </select>
                <input type="submit" />
              </form>
              <small className={styles.lightText} id={'cm-' + personId}></small>
            </div>
          :
            <p>No family people are eligible to betrothe!</p>
        }
      </div>
    )
  }
}