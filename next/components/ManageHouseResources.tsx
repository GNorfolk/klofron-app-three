import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'

export default function ManageHouseResources({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseResourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      person_id: number
      house_id: number
      resource_type: string
      resource_volume: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onDeposit: SubmitHandler<Inputs> = (formData) => {
      onSubmit(formData, true)
    }

    const onWithdraw: SubmitHandler<Inputs> = (formData) => {
      onSubmit(formData, false)
    }

    const onSubmit = (inputs, deposit) => {
      axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/resource', {
        person_id: inputs.person_id,
        house_id: router.query.id,
        resource_type: inputs.resource_type,
        resource_volume: deposit ? inputs.resource_volume * -1 : inputs.resource_volume
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + router.query.id).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + router.query.id).innerText = error.response.data.message
      })
    }

    if (isLoading) return (
      <div>
        <h2 className={styles.headingLg}>Resource Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.house_family.family_user_id === userId) { 
      return (
        <div>
          <h2 className={styles.headingLg}>Resource Info</h2>
          <p>{data.house_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage!</p>
          { data.house_people.map(({ person_name, person_food, person_wood }) => (
            <p>{person_name} has {person_food.resource_volume} food and {person_wood.resource_volume} wood.</p>
          ))}
          <h2 className={styles.headingLg}>Manage Resources</h2>
          {
            data.house_people.length > 0 ?
              <div>
                <form>
                  <select {...register("person_id")}>
                  { data.house_people.map(({ person_id, person_name }) => (
                    <option value={person_id}>{person_name}</option>
                  ))}
                  </select>
                  <select {...register("resource_type")}>
                    <option value="food">food</option>
                    <option value="wood">wood</option>
                  </select>
                  <input defaultValue="1" {...register("resource_volume")} />
                  <input type="submit" value="Deposit" onClick={handleSubmit(onDeposit)} />
                  <input type="submit" value="Withdraw" onClick={handleSubmit(onWithdraw)} />
                </form>
                <small className={styles.lightText} id={'cm-' + router.query.id}></small>
              </div>
            :
              <div>
                <p>This house does not have any people in it.</p>
              </div>
          }
        </div>
      )
    } else {
      router.push('/')
    }
  }
}