import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/Layout'
import axios from 'axios'
import { FormEventHandler, useState } from "react"
import { useSession } from 'next-auth/react'

const queryClient = new QueryClient()

export default function Person() {
  const { status, data } = useSession()
  if (status === "authenticated" && data.user.family_id) {
    return (
      <Layout>
        <QueryClientProvider client={queryClient}>
          <DescribePerson />
          <h2 className={styles.headingLg}>Actions Info</h2>
          <DescribePersonCurrentAction />
          <DescribePersonPreviousActions />
          <RenamePerson />
          <MoveHouse />
          <CreateProposal />
        </QueryClientProvider>
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <QueryClientProvider client={queryClient}>
          <DescribePerson />
          <h2 className={styles.headingLg}>Actions Info</h2>
          <DescribePersonCurrentAction />
          <DescribePersonPreviousActions />
        </QueryClientProvider>
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      </Layout>
    )
  }
}

function DescribePerson() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          <li className={styles.listItem} key={data.person_id}>
            {
              data.person_partner_id ?
                <p>{data.person_name} {data.person_family_name} is {data.person_gender} and {data.person_age} years old and is married to <Link href={"/person/" + data.person_partner_id}>{data.person_partner.person_name + " " + data.person_partner.person_family.family_name}</Link>.</p>
              :
              <p>{data.person_name} {data.person_family_name} is {data.person_gender} and {data.person_age} years old.</p>
            }
            <p>{data.person_name}'s father is <Link href={"/person/" + data.person_father.person_id}><a onClick={(e) => queryClient.invalidateQueries()}>{data.person_father.person_name + ' ' + data.person_father.person_family.family_name}</a></Link> and their mother is <Link href={"/person/" + data.person_mother.person_id}><a onClick={(e) => queryClient.invalidateQueries()}>{data.person_mother.person_name + ' ' + data.person_mother.person_family.family_name}</a></Link>.</p>
            { data.person_house_id ? <p>{data.person_name} lives at <Link href={"/house/" + data.person_house_id}>{data.person_house.house_name}</Link>.</p> : <p>{data.person_name} is homeless.</p> }
          </li>
        </ul>
      </div>
    )
  }
}

function DescribePersonCurrentAction() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personCurentActionsData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action?person_id=' + router.query.id + '&limit=1&current=true').then(
          (res) => res.json(),
        ),
    })

    const cancelAction = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/cancel-person-action/' + id)
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h3 className={styles.headingMd}>Curent Action</h3>
        <ul className={styles.list}>
          { data.length > 0 ? 
            data.map(({ action_id, action_type_name, action_started_time_ago }) => (
              <li className={styles.listItem} key={action_id}>
                <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago.</p>
                <button onClick={
                  () => {
                      cancelAction.mutate(action_id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }})
                  }
                } >Cancel Action</button>
              </li>
            )) : <p>No actions currently in progress!</p> }
        </ul>
      </div>
    )
  }
}

function DescribePersonPreviousActions() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personPreviousActionsData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action?person_id=' + router.query.id + '&limit=5&current=false').then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h3 className={styles.headingMd}>Previous Actions</h3>
        <ul className={styles.list}>
          {data.map(({ action_id, action_type_name, action_started_time_ago, action_finish_reason }) => (
            <li className={styles.listItem} key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago and finished with reason {action_finish_reason}.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function RenamePerson() {
  const router = useRouter()
  if (router.isReady) {
    const [personInfo, setpersonInfo] = useState({ name: "" })
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/rename-person/' + router.query.id, {
        name: personInfo.name
      }).then((value) => {
        queryClient.invalidateQueries()
      })
    };

    return (
      <div>
        <h2 className={styles.headingLg}>Rename Person</h2>
        <ul className={styles.list}>
          <form onSubmit={handleSubmit}>
            <input
              value={personInfo.name}
              onChange={({ target }) =>
                setpersonInfo({ ...personInfo, name: target.value })
              }
              placeholder="Insert name here"
            />
            <input type="submit" value="Rename" />
          </form>
        </ul>
      </div>
    )
  }
}

function MoveHouse() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['moveHouseData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/list-person-houses/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const movePersonHouse = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/move-person-house', {
          person_id: router.query.id,
          house_id: id,
          food: 0,
          wood: 0
        })
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Move House</h2>
          <ul className={styles.list}>
            {data.data.map(({ id, name }) => (
              <li className={styles.listItem} key={id}>
                Move into {name}: <button onClick={
                  () => {
                    movePersonHouse.mutate(id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }})
                  }
                } >Move</button>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Move House</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
  }
}

function CreateProposal() {
  const router = useRouter()
  if (router.isReady) {
    const id:any = router.query.id
    const createProposal = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-proposal/' + id)
      },
    })

    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Go to <Link href={`/proposal/${router.query.id}`}>Proposals</Link> page.</p>
        <button onClick={
          () => {
              createProposal.mutate(id, { onSettled: (res) => {
                queryClient.invalidateQueries()
              }
            })
          }
        }>Create Proposal</button>
      </div>
    )
  }
}