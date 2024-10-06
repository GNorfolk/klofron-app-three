import Link from 'next/link'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import { SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { HeaderTwo } from '@/components/ui/header'
import { Form, Input, Select } from '@/components/ui/form'
import { ListItem, Paragraph, Small } from '@/components/ui/text'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MinusIcon } from "@/components/ui/icon"

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeHouseResources queryClient={client} userId={userId} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function DescribeHouseResources({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseResourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <BoxLayoutSingle>
        <Container>
          <HeaderTwo>Resource Info</HeaderTwo>
          <Paragraph>Loading...</Paragraph>
        </Container>
      </BoxLayoutSingle>
    )
    if (error) return (
      <BoxLayoutSingle>
        <Container>
          <HeaderTwo>Resource Info</HeaderTwo>
          <Paragraph>Failed to load!</Paragraph>
        </Container>
      </BoxLayoutSingle>
    )

    if (data.house_family.family_user_id === userId) { 
      return (
        <BoxLayoutSingle>
          <ResourceInfo data={data} />
          <ManageResources data={data} router={router} queryClient={queryClient} />
          <DeleteResources data={data} queryClient={queryClient} />
        </BoxLayoutSingle>
      )
    } else {
      router.push('/')
    }
  }
}

function ResourceInfo({ data }) {
  return (
    <Container>
      <HeaderTwo>Resource Info</HeaderTwo>
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-muted/0'>
            <TableHead className="w-2/5 font-medium border-r">Name</TableHead>
            <TableHead className="w-3/10 font-medium border-r">Food</TableHead>
            <TableHead className="w-3/10 font-medium">Wood</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={0}>
            <TableCell className="w-2/5 font-medium border-r">{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name}</TableCell>
            <TableCell className="w-3/10 border-r">{data.house_food.resource_volume}</TableCell>
            <TableCell className="w-3/10">{data.house_wood.resource_volume}</TableCell>
          </TableRow>
          { data.house_people.map(({ person_id, person_name, person_food, person_wood, person_family }) => (
            <TableRow key={person_id}>
              <TableCell className="w-2/5 font-medium border-r">{person_name + " " + person_family.family_name}</TableCell>
              <TableCell className="w-3/10 border-r">{person_food.resource_volume}</TableCell>
              <TableCell className="w-3/10">{person_wood.resource_volume}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}


function ManageResources({ data, router, queryClient }) {
  type Inputs = {
    person_id: number
    house_id: number
    resource_type: string
    resource_volume: number
  }

  const onDeposit: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, true)
  }

  const onWithdraw: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, false)
  }

  const onSubmit = (inputs, deposit) => {
    axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/resource', {
      person_id: inputs.person_id,
      house_id: router.query.id,
      resource_type: inputs.resource_type,
      resource_volume: deposit ? inputs.resource_volume * -1 : inputs.resource_volume
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + router.query.id).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + router.query.id).innerText = error.response.data.message
    })
  }

  return (
    <Container>
      <HeaderTwo>Manage Resources</HeaderTwo>
      {
        data.house_people.length > 0 ?
          <div>
            <Form<Inputs> onSubmit={[{ name: "Desposit", func: onDeposit }, { name: "Withdraw", func: onWithdraw }]} styling={"grid gap-4 sm:grid-cols-3"}>
              <Select name="person_id">
                { data.house_people.map(({ person_id, person_name }) => (
                  <option value={person_id}>{person_name}</option>
                ))}
              </Select>
              <Select name="resource_type">
                <option value="food">Food</option>
                <option value="wood">Wood</option>
              </Select>
              <Input name="resource_volume" defaultValue="1" />
            </Form>
            <Small uid={router.query.id}></Small>
          </div>
        :
          <div>
            <p>This house does not have any people in it.</p>
          </div>
      }
    </Container>
  )
}

function DeleteResources({ data, queryClient }) {
  const decreaseWood = useMutation({
    mutationFn: (id) => {
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/resource', {
        action: "decrement",
        house_id: id,
        type_name: "wood"
      })
    },
  })

  const decreaseFood = useMutation({
    mutationFn: (id) => {
      return axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/resource', {
        action: "decrement",
        house_id: id,
        type_name: "food"
      })
    },
  })

  return (
    <Container>
      <HeaderTwo>Delete Resources</HeaderTwo>
      <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListItem>
          <div className="bg-background rounded-lg shadow-lg p-6 bg-slate-700">
            <div className="flex items-center justify-between my-2">
              <h3 className="text-lg font-semibold text-white">Wood</h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-medium">{data.house_wood.resource_volume} in storage!</span>
                <Button variant="outline" size="sm" onClick={ () => {
                  decreaseWood.mutate(data.house_id, { onSettled: (res) => {
                    queryClient.invalidateQueries();
                  }});
                }}>
                  <MinusIcon className="w-4 h-4" />
                  <span className='p-1'>Discard</span>
                </Button>
              </div>
            </div>
          </div>
        </ListItem>
        <ListItem>
          <div className="bg-background rounded-lg shadow-lg p-6 bg-slate-700">
            <div className="flex items-center justify-between my-2">
              <h3 className="text-lg font-semibold text-white">Food</h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-medium">{data.house_food.resource_volume} in storage!</span>
                <Button variant="outline" size="sm" onClick={ () => {
                  decreaseFood.mutate(data.house_id, { onSettled: (res) => {
                    queryClient.invalidateQueries();
                  }});
                }}>
                  <MinusIcon className="w-4 h-4" />
                  <span className='p-1'>Discard</span>
                </Button>
              </div>
            </div>
          </div>
        </ListItem>
      </ul>
    </Container>
  )
}
