import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function ListFamilyPeople({ queryClient = null, familyId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyMemberData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person?family_id=' + familyId).then(
        (res) => res.json(),
      ),
  })

  type Inputs = {
    mother_name: string
    father_name: string
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/person', [
      {
        person_name: formData.mother_name,
        person_gender: "female",
        person_family_id: familyId,
        person_mother_id: 1,
        person_father_id: 2
      },
      {
        person_name: formData.father_name,
        person_gender: "male",
        person_family_id: familyId,
        person_mother_id: 1,
        person_father_id: 2
      }
    ]).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("change-me-" + familyId).innerText = ' '
    }).catch(error => {
      document.getElementById("change-me-" + familyId).innerText = error.toString()
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  if (data.length > 0) {
    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ person_id, person_name, person_family, person_gender, person_age, person_house }) => (
            <li className={styles.listItem} key={person_id}>
              { person_house ?
                <p><Link href={"/person/" + person_id}>{person_name + ' ' + person_family.family_name}</Link> is {person_gender} and {person_age} years old and lives at {person_house.house_name}.</p>
              :
                <p><Link href={"/person/" + person_id}>{person_name + ' ' + person_family.family_name}</Link> is {person_gender} and {person_age} years old and is currently unhoused.</p>
              }
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <p>This family does not have any people in it.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input defaultValue="motherName" {...register("mother_name")} />
              <input defaultValue="fatherName" {...register("father_name")} />
              <input type="submit" />
            </form>
            <small className={styles.lightText} id={'change-me-' + familyId}></small>
          </li>
        </ul>
      </div>
    )
  }
}