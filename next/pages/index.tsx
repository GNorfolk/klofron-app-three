import Layout from '../components/Layout'
import styles from '../styles/main.module.css'
import Link from 'next/link'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Router from "next/router"
import { useEffect } from "react"

const queryClient = new QueryClient()
let familyId

export default function Family() {
  const { status, data } = useSession()
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/family")
  }, [status])
  if (status === "authenticated") {
    familyId = data.user.family_id
    return (
      <Layout>
      <QueryClientProvider client={queryClient}>
          <DescribeFamily />
          <ListFamilyPeople />
          <ListFamilyHouses />
        </QueryClientProvider>
    </Layout>
    )
  }
  return <div>Loading...</div>
}

function DescribeFamily() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family.</h1>
    </div>
  )
}

function ListFamilyHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyHouseData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house?family_id=' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>House Info</h2>
      <ul className={styles.list}>
        {data.map(({ house_id, house_name, house_family, house_food, house_wood }) => (
          <li className={styles.listItem} key={house_id}>
            <p>The {house_family.family_name} family own <Link href={`/house/${house_id}`}>{house_name}</Link> which holds {house_food.resource_volume} food and {house_wood.resource_volume} wood.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ListFamilyPeople() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyMemberData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person?family_id=' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Person Info</h2>
      <ul className={styles.list}>
        {data.map(({ person_id, person_name, person_family, person_gender, person_age, person_house }) => (
          <li className={styles.listItem} key={person_id}>
            <p><Link href={"/person/" + person_id}>{person_name + ' ' + person_family.family_name}</Link> is {person_gender} and {person_age} years old and lives at {person_house.house_name}.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
