import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function ListFamilyHouses({ data, queryClient = null, familyId, unnamedBoolean = false }) {
  type Inputs = {
    house_name: string
    house_family_id: number
    house_rooms: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/house', {
      house_name: formData.house_name,
      house_family_id: familyId,
      house_rooms: 2
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + familyId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + familyId).innerText = error.toString()
    })
  }

  if (data.family_houses.length > 0) {
    return (
      <div>
        <h2 className={styles.headingLg}>House Info</h2>
        <ul className={styles.list}>
          {data.family_houses.map(({ house_id, house_name, house_family, house_food, house_wood }) => (
            <li className={styles.listItem} key={house_id}>
              <p>The {data.family_name} family own <Link href={`/house/${house_id}`}>{house_name}</Link> which holds {house_food.resource_volume} food and {house_wood.resource_volume} wood.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>House Info</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <p>This family does not own any houses.</p>
            {
              unnamedBoolean ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input defaultValue="houseName" {...register("house_name")} />
                    <input type="submit" />
                  </form>
                  <small className={styles.lightText} id={'cm-' + familyId}></small>
                </div>
              : null
            }
          </li>
        </ul>
      </div>
    )
  }
}