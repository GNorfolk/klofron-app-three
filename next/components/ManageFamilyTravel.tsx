import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'

export default function ManageFamilyTravel({ familyId, queryClient }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyTravelData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + familyId).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      person_id: number
      house_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + formData.person_id, {
        house_id: formData.house_id
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + familyId).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + familyId).innerText = error.toString()
      })
    }

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        { data.family_people.map(({ person_name, person_house_id, person_house }) => (
          person_house_id ? <p>{person_name} lives at {person_house.house_name}.</p> : <p>{person_name} is unhoused.</p>
        ))}
        <h2 className={styles.headingLg}>Manage Travel</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <select {...register("person_id")}>
          { data.family_people.map(({ person_id, person_name }) => (
            <option value={person_id}>{person_name}</option>
          ))}
          </select>
          <select {...register("house_id")}>
          { data.family_houses.map(({ house_id, house_name }) => (
            <option value={house_id}>{house_name}</option>
          ))}
          </select>
          <input type="submit" />
        </form>
        <small className={styles.lightText} id={'cm-' + router.query.id}></small>
      </div>
    )
  }
}