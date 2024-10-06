import Link from 'next/link'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { FormEventHandler, useState } from "react"
import { BoxLayout } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { BetrothalInfo } from '@/components/component/betrothal'
import { HeaderTwo } from '@/components/ui/header'
import { ListItem } from '@/components/ui/text'
import { DivIconInfo } from '@/components/ui/div'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribePerson queryClient={client} status={status} userId={userId} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function DescribePerson({ queryClient, status, userId = null, router }) {
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
            <ListPersonSkills personSkills={data.person_skills} />
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
            <ListItem key={currentAction.action_id}>
              <p>Action with id {currentAction.action_id} of type {currentAction.action_type_name} was started {currentAction.action_started_time_ago} ago.</p>
              <button onClick={
                () => {
                    cancelAction.mutate(currentAction.action_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Cancel Action</button>
            </ListItem>
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
            <ListItem key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} is number {index + 1} in the queue.</p>
              <button onClick={
                () => {
                    cancelAction.mutate(action_id, { onSettled: (res) => {
                    queryClient.invalidateQueries()
                  }})
                }
              } >Cancel Action</button>
            </ListItem>
          ))}
        </ul>
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderTwo>Next Actions</HeaderTwo>
        <ul className="list-none p-0 m-0">
            <ListItem>
              <p>This person has no future actions initiated.</p>
            </ListItem>
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
            <ListItem key={action_id}>
              <p>Action with id {action_id} of type {action_type_name} was started {action_started_time_ago} ago and finished with reason {action_finish_reason}.</p>
            </ListItem>
          ))}
        </ul>
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderTwo>Previous Actions</HeaderTwo>
        <ul className="list-none p-0 m-0">
            <ListItem>
              <p>This person has no past actions initiated.</p>
            </ListItem>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        <DivIconInfo iconType="UserIcon">{data.person_name + " " + data.person_family.family_name + " is " + data.person_gender + " and " + data.person_age + " years old."}</DivIconInfo>
        <DivIconInfo iconType="ChurchIcon">{data.person_name + " " + data.person_family.family_name + " is  married to " + data.person_partner.person_name + " " + data.person_partner.person_family.family_name}</DivIconInfo>
        <DivIconInfo iconType="UsersIcon">{data.person_name + "'s father is " + data.person_father.person_name + " " + data.person_father.person_family.family_name}</DivIconInfo>
        <DivIconInfo iconType="UsersIcon">{data.person_name + "'s mother is " + data.person_mother.person_name + " " + data.person_mother.person_family.family_name}</DivIconInfo>
        <DivIconInfo iconType="MapPinIcon">{data.person_name + " lives at " + data.person_house.house_address.house_address_number + " " + data.person_house.house_address.house_address_road.house_road_name}</DivIconInfo>
      </div>
    </Container>
  )
}

function ListPersonSkills({ personSkills }) {
  return (
    <Container>
      <HeaderTwo>Skills Info</HeaderTwo>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-muted/0'>
            <TableHead className="w-2/5 font-medium border-r">Skill</TableHead>
            <TableHead className="w-3/10 font-medium border-r">Level</TableHead>
            <TableHead className="w-3/10 font-medium">Level-up XP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key="gatherer">
            <TableCell className="w-2/5 font-medium border-r">Gatherer</TableCell>
            <TableCell className="w-3/10 border-r">{personSkills.person_skills_gatherer_level}</TableCell>
            <TableCell className="w-3/10">{Math.pow(2, personSkills.person_skills_gatherer_level + 1) - personSkills.person_skills_gatherer_experience}</TableCell>
          </TableRow>
          <TableRow key="lumberjack">
            <TableCell className="w-2/5 font-medium border-r">Lumberjack</TableCell>
            <TableCell className="w-3/10 border-r">{personSkills.person_skills_lumberjack_level}</TableCell>
            <TableCell className="w-3/10">{Math.pow(2, personSkills.person_skills_lumberjack_level + 1) - personSkills.person_skills_lumberjack_experience}</TableCell>
          </TableRow>
          <TableRow key="builder">
            <TableCell className="w-2/5 font-medium border-r">Builder</TableCell>
            <TableCell className="w-3/10 border-r">{personSkills.person_skills_builder_level}</TableCell>
            <TableCell className="w-3/10">{Math.pow(2, personSkills.person_skills_builder_level + 1) - personSkills.person_skills_builder_experience}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  )
}


function DescribePersonTeacher({ data, personId }) {
  return (
    <Container>
      <HeaderTwo>Teacher Info</HeaderTwo>
      <div className="flex items-center mt-4 mx-2 text-sm text-gray-500 dark:text-gray-400">
        {
          data.person_teacher_id ? <>
            <Link href={personId + "/teacher"}>This person has {data.person_teacher.person_name} as their teacher.</Link>
          </> : <>
            <Link href={personId + "/teacher"}>This person does not have a teacher.</Link>
          </>
        }
      </div>
    </Container>
  )
}