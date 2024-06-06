import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'

export default function DescribeFamilyTravel({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyTravelData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
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
      if (formData.person_id) {
        axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + formData.person_id, {
          house_id: formData.house_id
        }).then(response => {
          queryClient.invalidateQueries()
          document.getElementById("cm-" + router.query.id).innerText = ' '
        }).catch(error => {
          document.getElementById("cm-" + router.query.id).innerText = error.response.data.message
        })
      } else {
        document.getElementById("cm-" + router.query.id).innerText = 'CustomError: The Person field is required'
      }
    }

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <div>
          <h2 className={styles.headingLg}>Travel Info</h2>
          {
            data.family_people.length > 0 ? 
              data.family_people.map(({ person_name, person_house_id, person_house }) => (
                person_house_id ? <p>{person_name} lives at {person_house.house_name}.</p> : <p>{person_name} is unhoused.</p>
              ))
            :
              <p>This family does not have any people in it.</p>
          }
          <h2 className={styles.headingLg}>Manage Travel</h2>
          {
            data.family_people.length > 0 && data.family_houses.length > 0 ?
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <select {...register("person_id", { required: true })}>
                  { errors.person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null }
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
            :
              <div>
                <p>This family has {data.family_people.length} people and {data.family_houses.length} houses but both must be above 0.</p>
              </div>
          }
        </div>
      )
    } else {
      router.push('/')
    }
  }
}