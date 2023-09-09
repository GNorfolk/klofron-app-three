import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Layout, { siteTitle } from '../../components/layout'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Router from "next/router"
import { useEffect } from "react"

const queryClient = new QueryClient()
let familyId

export default function Family() {
  const { status, data } = useSession()
  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/api/auth/signin")
  }, [status])
  if (status === "authenticated") {
    familyId = data.user.family_id
    return (
      <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
          <DescribeFamily />
          <ListFamilyPeople />
          <ListFamilyHouses />
        </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
    )
  }
  return <div>Loading...</div>
}

function DescribeFamily() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-family/' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      {data.map(({ id, name }) => (
        <h1 className={styles.heading2Xl} key={id}>The {name} family.</h1>
      ))}
    </div>
  )
}

function ListFamilyHouses() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyHouseData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-family-houses/' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>House Info</h2>
      <ul className={styles.list}>
        {data.map(({ id, name, family_name, food, wood }) => (
          <li className={styles.listItem} key={id}>
            <p>The {family_name} family own <Link href={`/house/${id}`}>{name}</Link>.</p>
            <p>House {name} holds {food} food and {wood} wood.</p>
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
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-family-people/' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div>
      <h2 className={styles.headingLg}>Person Info</h2>
      <ul className={styles.list}>
        {data.map(({ id, name, family_name, gender, age, house_name }) => (
          <li className={styles.listItem} key={id}>
            <p><Link href={"/person/" + id}>{name + ' ' + family_name}</Link> is {gender} and {age} years old and lives at {house_name}.</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
