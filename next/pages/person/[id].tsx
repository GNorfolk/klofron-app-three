import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Layout from '../../components/layout'
import axios from 'axios'
import { FormEventHandler, useState } from "react"

const queryClient = new QueryClient()

export default function Person() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribePerson />
        <DescribePersonActions />
        <RenamePerson />
        <MoveHouse />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/family">← Back to home</Link>
      </div>
    </Layout>
  )
}

function DescribePerson() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-person/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, gender, age, house_id, house_name, father_id, father_name, father_family_name, mother_id, mother_name, mother_family_name }) => (
            <li className={styles.listItem} key={id}>
              <p>{name} {family_name} is {gender} and {age} years old.</p>
              <p>{name}'s father is <Link href={"/person/" + father_id}><a onClick={(e) => queryClient.invalidateQueries()}>{father_name + ' ' + father_family_name}</a></Link> and their mother is <Link href={"/person/" + mother_id}><a onClick={(e) => queryClient.invalidateQueries()}>{mother_name + ' ' + mother_family_name}</a></Link>.</p>
              { house_id ? <p>{name} lives at <Link href={"/house/" + house_id}>{house_name}</Link>.</p> : <p>{name} is homeless.</p> }
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function DescribePersonActions() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personActionsData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-person-actions/' + router.query.id).then(
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

    if (data.success) {
      return (
        <div>
          <h2 className={styles.headingLg}>Actions Info</h2>
          <h3 className={styles.headingMd}>Curent Action</h3>
          <ul className={styles.list}>
            { data.current_action.length > 0 ? 
              data.current_action.map(({ id, type_name, started_time_ago, finish_reason }) => (
                <li className={styles.listItem} key={id}>
                  <p>Action with id {id} of type {type_name} was started {started_time_ago} ago.</p>
                  <button onClick={
                    () => {
                        cancelAction.mutate(id, { onSettled: (res) => {
                        queryClient.invalidateQueries()
                      }})
                    }
                  } >Cancel Action</button>
                </li>
              )) : <p>No actions currently in progress!</p> }
          </ul>
          <h3 className={styles.headingMd}>Previous Actions</h3>
          <ul className={styles.list}>
            {data.previous_actions.map(({ id, type_name, started_time_ago, finish_reason }) => (
              <li className={styles.listItem} key={id}>
                <p>Action with id {id} of type {type_name} was started {started_time_ago} ago and finished with reason {finish_reason}.</p>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>Actions Info</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
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
          food: 2,
          wood: 0
        })
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <div>
        <h2 className={styles.headingLg}>Move House</h2>
        <ul className={styles.list}>
          {data.map(({ id, name }) => (
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
  }
}