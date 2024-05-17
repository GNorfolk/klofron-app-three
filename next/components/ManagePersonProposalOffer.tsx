import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function ManagePersonProposalOffer({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['ManagePersonProposalOfferData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal-offer', {
        person_id: formData.person_id
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + router.query.id).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + router.query.id).innerText = error.response.data.message
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
      ppl.person_age >= 18 && ppl.person_partner_id === null && ppl.person_id != router.query.id
    )

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Offer</h2>
        {
          familyBachelors.length > 0 ?
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <select {...register("person_id", { required: true })}>
                {
                  errors.person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null
                }
                {
                  familyBachelors.map(({ person_id, person_name }) => (
                    <option value={person_id}>{person_name}</option>
                  ))
                }
                </select>
                <input type="submit" />
              </form>
              <small className={styles.lightText} id={'cm-' + router.query.id}></small>
            </div>
          :
            <p>No family people are eligible to betrothe!</p>
        }
      </div>
    )
  }
}