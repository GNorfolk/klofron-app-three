import Link from 'next/link'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { FormEventHandler, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayout } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { PersonListing } from '../@/components/component/person'
import { HouseListing } from '../@/components/component/house'
import { BetrothalInfo } from '../@/components/component/betrothal'
import { Button } from "../@/components/ui/button"
import { HeaderTwo } from '../@/components/ui/header'

export default function DescribePerson({ queryClient, status, userId = null, router }) {
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
            <ListPersonSkills queryClient={queryClient} data={data.person_skills}/>
            { status === "authenticated" && userId == data.person_family.family_user_id ? <ListPersonBetrothals data={data} router={router} /> : <></> }
            <DescribePersonTeacher data={data} personId={router.query.person_id} />
          </div>
        } right={
          <div>
            <ListPersonActionsCurrent currentAction={data.person_action_queue?.action_queue_current_action} queryClient={queryClient} personId={router.query.person_id} />
            <ListPersonActionsNext nextActions={data.person_action_queue.action_queue_next_actions} queryClient={queryClient} />
            <ListPersonActionsPrevious previousActions={data.person_action_queue.action_queue_previous_actions} personId={router.query.person_id} />
            <RenamePerson queryClient={queryClient} personId={router.query.person_id} />
          </div>
        } />
      </QueryClientProvider>
    )
  }
}

function ListPersonActionsCurrent({ currentAction, queryClient, personId }) {
  const cancelAction = useMutation({
    mutationFn: (id) => {
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action/' + id, {
        action: "cancel"
      })
    },
  })

  return (
    <Container>
      <HeaderTwo>Current Action</HeaderTwo>
      <ul className="list-none p-0 m-0">
        {
          currentAction ? <>
            <li className="mt-0 mx-0 mb-5" key={currentAction.action_id}>
              <p>Action with id {currentAction.action_id} of type {currentAction.action_type_name} was started {currentAction.action_started_time_ago} ago.</p>
              <button onClick={
                () => {
                    cancelAction.mutate(currentAction.action_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Cancel Action</button>
            </li>
          </> : <>
          <p>No actions currently in progress!</p>
          </>
        }
      </ul>
    </Container>
  )
}

function ListPersonActionsNext({ nextActions, queryClient }) {
  const cancelAction = useMutation({
    mutationFn: (id) => {
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/action/' + id, {
        action: "cancel"
      })
    },
  })

  if (nextActions.length > 0) {
    return (
      <Container>
        <HeaderTwo>Next Actions</HeaderTwo>
        <ul className="list-none p-0 m-0">
          {nextActions.map(({ action_id, action_type_name, action_created_at }, index) => (
            <li className="mt-0 mx-0 mb-5" key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} is number {index + 1} in the queue.</p>
              <button onClick={
                () => {
                    cancelAction.mutate(action_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Cancel Action</button>
            </li>
          ))}
        </ul>
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderTwo>Next Actions</HeaderTwo>
        <ul className="list-none p-0 m-0">
            <li className="mt-0 mx-0 mb-5">
              <p>This person has no future actions initiated.</p>
            </li>
        </ul>
      </Container>
    )
  }
}

function ListPersonActionsPrevious({ previousActions, personId }) {
  const fivePreviousActions = previousActions.slice(-5)
  if (fivePreviousActions.length > 0) {
    return (
      <Container>
        <HeaderTwo>Previous Actions</HeaderTwo>
        <ul className="list-none p-0 m-0">
          {fivePreviousActions.map(({ action_id, action_type_name, action_started_time_ago, action_finish_reason }) => (
            <li className="mt-0 mx-0 mb-5" key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago and finished with reason {action_finish_reason}.</p>
            </li>
          ))}
        </ul>
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderTwo>Previous Actions</HeaderTwo>
        <ul className="list-none p-0 m-0">
            <li className="mt-0 mx-0 mb-5">
              <p>This person has no past actions initiated.</p>
            </li>
        </ul>
      </Container>
    )
  }
}

function ListPersonBetrothals({ data, router }) {
  if (router.isReady) {
    return (
      <Container>
        <BetrothalInfo personInfo={data} />
      </Container>
    )
  }
}

function RenamePerson({ queryClient, personId }) {
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
      <HeaderTwo>Rename Person</HeaderTwo>
      <ul className="list-none p-0 m-0">
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

function ListPersonInfo({ data, queryClient }) {
  return (
    <Container>
      <HeaderTwo>Person Info</HeaderTwo>
      <ul className="list-none p-0 m-0">
        <li className="mt-0 mx-0 mb-5" key={data.person_id}>
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

function ListPersonSkills({ data, queryClient }) {
  return (
    <Container>
      <HeaderTwo>Skills Info</HeaderTwo>
      <p>Gatherer level: {data.person_skills_gatherer_level}.</p>
      <p>Exp to next level: {Math.pow(2, data.person_skills_gatherer_level + 1) - data.person_skills_gatherer_experience}</p>
      <p>Lumberjack level: {data.person_skills_lumberjack_level}.</p>
      <p>Exp to next level: {Math.pow(2, data.person_skills_lumberjack_level + 1) - data.person_skills_lumberjack_experience}</p>
      <p>Builder level: {data.person_skills_builder_level}.</p>
      <p>Exp to next level: {Math.pow(2, data.person_skills_builder_level + 1) - data.person_skills_builder_experience}</p>
    </Container>
  )
}

function DescribePersonTeacher({ data, personId }) {
  return (
    <Container>
      <HeaderTwo>Teacher Info</HeaderTwo>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        {
          data.person_teacher_id ? <>
            <a href={personId + "/teacher"}>This person has a teacher with id {data.person_teacher_id}.</a>
          </> : <>
            <a href={personId + "/teacher"}>This person does not have a teacher.</a>
          </>
        }
      </div>
    </Container>
  )
}