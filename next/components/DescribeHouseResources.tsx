import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { MapPinIcon } from "../@/components/ui/icon"
import { HeaderTwo } from '../@/components/ui/header'
import { StyledSelect } from '../@/components/ui/input'

export default function DescribeHouseResources({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseResourceData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

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

    type Inputs = {
      person_id: number
      house_id: number
      resource_type: string
      resource_volume: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

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

    if (isLoading) return (
      <div>
        <HeaderTwo>Resource Info</HeaderTwo>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.house_family.family_user_id === userId) { 
      return (
        <BoxLayoutSingle>
          <Container>
            <HeaderTwo>Resource Info</HeaderTwo>
            <p>{data.house_address.house_address_number + " " + data.house_address.house_address_road.house_road_name} has {data.house_food.resource_volume} food and {data.house_wood.resource_volume} wood in storage!</p>
            { data.house_people.map(({ person_name, person_food, person_wood }) => (
              <p>{person_name} has {person_food.resource_volume} food and {person_wood.resource_volume} wood.</p>
            ))}
          </Container>
          <Container>
            <HeaderTwo>Manage Resources</HeaderTwo>
            {
              data.house_people.length > 0 ?
                <div>
                  <form className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <StyledSelect {...register("person_id")}>
                      { data.house_people.map(({ person_id, person_name }) => (
                        <option value={person_id}>{person_name}</option>
                      ))}
                      </StyledSelect>
                      <StyledSelect {...register("resource_type")}>
                        <option value="food">Food</option>
                        <option value="wood">Wood</option>
                      </StyledSelect>
                      <input defaultValue="1" {...register("resource_volume")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Button type="submit" onClick={handleSubmit(onDeposit)} className="w-full">Deposit</Button>
                      <Button type="submit" onClick={handleSubmit(onWithdraw)} className="w-full">Withdraw</Button>
                    </div>
                  </form>
                  <small className="text-gray-500" id={'cm-' + router.query.id}></small>
                </div>
              :
                <div>
                  <p>This house does not have any people in it.</p>
                </div>
            }
          </Container>
          <Container>
            <HeaderTwo>Delete Resources</HeaderTwo>
            <ul className="list-none p-0 m-0">
              <li className="mt-0 mx-0 mb-5">
                <p>Wood: {data.house_wood.resource_volume} in storage! <button onClick={
                  () => {
                      decreaseWood.mutate(data.house_id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }})
                  }
                } >Decrease Wood</button></p>
              </li>
              <li className="mt-0 mx-0 mb-5">
                <p>Food: {data.house_food.resource_volume} in storage! <button onClick={
                  () => {
                      decreaseFood.mutate(data.house_id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                    }})
                  }
                } >Decrease Food</button></p>
              </li>
            </ul>
          </Container>
        </BoxLayoutSingle>
      )
    } else {
      router.push('/')
    }
  }
}