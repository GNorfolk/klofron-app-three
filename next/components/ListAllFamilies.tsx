import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function ListAllFamilies({ queryClient = null, userId = null }) {
  const fetchQuery = userId ? '/v2/family?show_empty=true&user_id=' + userId : '/v2/family'
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then(
        (res) => res.json(),
      ),
  })

  type Inputs = {
    family_name: string
    family_user_id: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/family', {
      family_name: formData.family_name,
      family_user_id: userId
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + userId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + userId).innerText = error.toString()
    })
  }

  if (isLoading) return (
    <div>
      <h2 className={styles.headingLg}>Families</h2>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  if (userId) { // TODO: Add empty handling like ListHousePeople
    return (
      <div>
        <h2 className={styles.headingLg}>Families</h2>
        <ul className={styles.list}>
          { data.length > 0 ? data.map(({ family_id, family_name }) => (
            <li className={styles.listItem} key={family_id}>
              <p>The <Link href={`/family/${family_id}`}>{family_name}</Link> family.</p>
            </li>
          )) :
            <li className={styles.listItem}>
              <p>This user does not own any families.</p>
            </li>
          }
        </ul>
        <h2 className={styles.headingLg}>Create Family</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input defaultValue="familyName" {...register("family_name", { required: true })} />
          { errors.family_name && <span>This field is required</span> }
          <input type="submit" />
        </form>
        <small className={styles.lightText} id={'cm-' + userId}></small>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className={styles.headingLg}>Families</h2>
        <ul className={styles.list}>
          { data.map(({ family_id, family_name }) => (
            <li className={styles.listItem} key={family_id}>
              <p>The <Link href={`/family/${family_id}`}>{family_name}</Link> family.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}