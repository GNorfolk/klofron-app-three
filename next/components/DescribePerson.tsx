import Link from 'next/link'
import styles from '../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { FormEventHandler, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayout } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { PersonListing } from '../@/components/component/person-listing'
import { HouseListing } from '../@/components/component/house-listing'

export default function DescribePerson({ queryClient, status, userId = null }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personData' + router.query.person_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.person_id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayout left={
          <div>
            <ListPersonInfo queryClient={queryClient} data={data}/>
            <br />
            {
              status === "authenticated" && userId == data.person_family.family_user_id ?
              <div>
                <ListPersonProposals data={data} userId={userId} showOffers={false} />
              </div>
              :
              <></>
            }
          </div>
        } right={
          <div>
            <ListPersonActionsCurrent queryClient={queryClient} personId={router.query.person_id} />
            <br />
            <ListPersonActionsPrevious personId={router.query.person_id} />
            <br />
            <RenamePerson queryClient={queryClient} personId={router.query.person_id} />
          </div>
        } />
      </QueryClientProvider>
    )
  }
}

export function ListPersonActionsCurrent({ queryClient, personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['personCurentActionsData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action?person_id=' + personId + '&limit=1&current=true').then(
        (res) => res.json(),
      ),
  })

  const cancelAction = useMutation({
    mutationFn: (id) => {
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action/' + id, {
        action: "cancel"
      })
    },
  })

  if (isLoading) return (
    <div>
      <h3 className={styles.headingMd}>Current Action</h3>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  return (
    <Container>
      <h3 className={styles.headingMd}>Current Action</h3>
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
    </Container>
  )
}

export function ListPersonActionsPrevious({ personId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['personPreviousActionsData' + personId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action?person_id=' + personId + '&limit=5&current=false').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return (
    <div>
      <h3 className={styles.headingMd}>Previous Actions</h3>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  if (data.length > 0) {
    return (
      <Container>
        <h3 className={styles.headingMd}>Previous Actions</h3>
        <ul className={styles.list}>
          {data.map(({ action_id, action_type_name, action_started_time_ago, action_finish_reason }) => (
            <li className={styles.listItem} key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago and finished with reason {action_finish_reason}.</p>
            </li>
          ))}
        </ul>
      </Container>
    )
  } else {
    return (
      <Container>
        <h3 className={styles.headingMd}>Previous Actions</h3>
        <ul className={styles.list}>
            <li className={styles.listItem}>
              <p>This person has no past actions initiated.</p>
            </li>
        </ul>
      </Container>
    )
  }
}

export function ListPersonProposals({ data, showLink = true, queryClient = null, userId, showOffers = true }) {
  const router = useRouter()
  if (router.isReady) {
    const createProposal = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal', {
          proposal_person_id: id
        })
      },
    })

    type Inputs = {
      proposal_offer_id: number
      accepter_person_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/proposal-offer/' + formData.proposal_offer_id, {
        accepter_person_id: formData.accepter_person_id,
      }).then(response => {
        queryClient.invalidateQueries()
        document.getElementById("cm-" + userId).innerText = ' '
      }).catch(error => {
        document.getElementById("cm-" + userId).innerText = error.response.data.message
      })
    }

    const familyBachelors = data.person_family.family_people.filter(ppl =>
      ppl.person_age >= 18 && ppl.person_partner_id === null
    )

    return (
      <Container>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <ul className={styles.list}>
          {
            data.person_proposals.length > 0 ?
              data.person_proposals.map(({ proposal_id, proposal_offers }) => (
                <li className={styles.listItem} key={data.proposal_id}>
                  <p>{data.person_name} has an existing proposal with id {proposal_id}.</p>
                  {
                    showOffers ?
                      proposal_offers.length > 0 ?
                        proposal_offers.map(({ proposal_offer_person, proposal_offer_dowry }) => (
                          <p>
                            Person with proposal is {data.person_name} who is {data.person_gender} and is {data.person_age} years old.
                            Person {data.person_name} will be betrothed to {proposal_offer_person.person_name} who is {proposal_offer_person.person_gender} and {proposal_offer_person.person_age} years old. 
                            They are also offering {proposal_offer_dowry.proposal_dowry_person.person_name} who is {proposal_offer_dowry.proposal_dowry_person.person_gender} and {proposal_offer_dowry.proposal_dowry_person.person_age} years old.
                          </p>
                        ))
                      :
                        <p>This proposal has no proposal offers.</p>
                    :
                      null
                  }
                  {
                    proposal_offers.length > 0 ?
                      familyBachelors.length > 0 ?
                        <div>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <select {...register("proposal_offer_id", { required: true })}>
                              {
                                errors.proposal_offer_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null
                              }
                              {
                                proposal_offers.map(({ proposal_offer_id, proposal_offer_person, proposal_offer_dowry }) => (
                                  <option value={proposal_offer_id}>{proposal_offer_person.person_name + " / " + proposal_offer_dowry.proposal_dowry_person.person_name}</option>
                                ))
                              }
                            </select>
                            <select {...register("accepter_person_id", { required: true })}>
                              {
                                errors.accepter_person_id ? document.getElementById("cm-" + router.query.id).innerText = "The Person field is required" : null
                              }
                              {
                                familyBachelors.map(({ person_id, person_name }) => (
                                  <option value={person_id}>{person_name}</option>
                                ))
                              }
                            </select>
                            <input type="submit" />
                          </form>
                          <small className={styles.lightText} id={'cm-' + userId}></small>
                        </div>
                      :
                        <p>There are no family people eligible to accept an offer.</p>
                    :
                      null
                  }
                </li>
              ))
            :
              <div>
                <p>{data.person_name} is not open to proposal offers!</p>
                {
                  data.person_family.family_user_id === userId ?
                    <button onClick={
                      () => {
                          createProposal.mutate(data.person_id, { onSettled: (res) => {
                            queryClient.invalidateQueries()
                          }
                        })
                      }
                    }>Create Proposal</button>
                  :
                    null
                }
              </div>
          }
        </ul>
        {
          showLink ? <p>Go to <Link href={`/person/${router.query.person_id}/proposal`}>Proposals</Link> page.</p> : null
        }
      </Container>
    )
  }
}

export function RenamePerson({ queryClient, personId }) {
  const [personInfo, setpersonInfo] = useState({ name: "" })
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + personId, {
      name: personInfo.name
    }).then((value) => {
      queryClient.invalidateQueries()
    })
  };

  return (
    <Container>
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
    </Container>
  )
}

export function ListPersonInfo({ data, queryClient }) {
  return (
    <Container>
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
          {
            data.person_house_id ? <p>{data.person_name} lives at <Link href={"/house/" + data.person_house_id}>{data.person_house.house_address.house_address_number + " " + data.person_house.house_address.house_address_road.house_road_name}</Link>.</p> : <p>{data.person_name} is homeless.</p>
          }
        </li>
      </ul>
    </Container>
  )
}