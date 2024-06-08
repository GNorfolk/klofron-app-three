import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"

export default function DescribeFamily({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <QueryClientProvider client={queryClient}>
          <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family</h1>
          <ListFamilyPeople data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={true} />
          <ListFamilyHouses data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={true} />
          <ListFamilyTravel data={data} />
          <ListFamilyProposals data={data} />
        </QueryClientProvider>
      )
    } else {
      return (
        <QueryClientProvider client={queryClient}>
          <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family</h1>
          <ListFamilyPeople data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={false} />
          <ListFamilyHouses data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={false} />
        </QueryClientProvider>
      )
    }
  }
}

export function ListFamilyHouses({ data, queryClient = null, familyId, unnamedBoolean = false }) {
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


export function ListFamilyPeople({ data, queryClient = null, familyId, unnamedBoolean = false }) {
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
        person_mother_id: 2,
        person_father_id: 1
      },
      {
        person_name: formData.father_name,
        person_gender: "male",
        person_family_id: familyId,
        person_mother_id: 2,
        person_father_id: 1
      }
    ]).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + familyId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + familyId).innerText = error.toString()
    })
  }

  if (data.family_people.length > 0) {
    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.family_people.map(({ person_id, person_name, person_family, person_gender, person_age, person_house }) => (
            <li className={styles.listItem} key={person_id}>
              { person_house ?
                // ToDo: Remove house.house_name
                <p><Link href={"/person/" + person_id}>{person_name + ' ' + data.family_name}</Link> is {person_gender} and {person_age} years old and lives at {person_house.house_address.house_address_number + ", " + person_house.house_address.house_address_road.house_road_name}.</p>
              :
                <p><Link href={"/person/" + person_id}>{person_name + ' ' + data.family_name}</Link> is {person_gender} and {person_age} years old and is currently unhoused.</p>
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
            {
              unnamedBoolean ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input defaultValue="motherName" {...register("mother_name")} />
                    <input defaultValue="fatherName" {...register("father_name")} />
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

export function ListFamilyProposals({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Go to <Link href={`/family/${router.query.id}/proposal`}>Proposal Management</Link> page.</p>
      </div>
    )
  }
}

export function ListFamilyTravel({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Go to <Link href={`/family/${router.query.id}/travel`}>Travel Management</Link> page.</p>
      </div>
    )
  }
}