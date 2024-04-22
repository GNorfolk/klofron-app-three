import Link from 'next/link'
import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { FormEventHandler, useState } from "react"
import ListPersonActionsCurrent from './ListPersonActionsCurrent'
import ListPersonActionsPrevious from './ListPersonActionsPrevious'
import ListPersonHouses from './ListPersonHouses'

export default function DescribePerson({ queryClient, status, userId = null }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const [personInfo, setpersonInfo] = useState({ name: "" })
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.id, {
        name: personInfo.name
      }).then((value) => {
        queryClient.invalidateQueries()
      })
    };

    const createProposal = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-proposal/' + id)
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
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
        <h2 className={styles.headingLg}>Actions Info</h2>
        <ListPersonActionsCurrent queryClient={queryClient} personId={router.query.id} />
        <ListPersonActionsPrevious personId={router.query.id} />
        {
          status === "authenticated" && userId == data.person_family.family_user_id ?
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
            <ListPersonHouses queryClient={queryClient} personId={router.query.id} familyId={data.person_family_id} houseId={data.person_house_id} />
            <h2 className={styles.headingLg}>Proposal Info</h2>
            <p>Go to <Link href={`/proposal/${router.query.id}`}>Proposals</Link> page.</p>
            <button onClick={
              () => {
                  createProposal.mutate(data.person_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }
                })
              }
            }>Create Proposal</button>
          </div>
          :
          <></>
        }
      </QueryClientProvider>
    )
  }
}