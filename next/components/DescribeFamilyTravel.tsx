import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { MapPinIcon } from "../@/components/ui/icon"

export default function DescribeFamilyTravel({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyTravelData' + router.query.family_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.family_id).then(
          (res) => res.json(),
        ),
    })

    type Inputs = {
      person_id: number
      house_id: number
    }

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (formData) => {
      if (formData.person_id) {
        axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + formData.person_id, {
          house_id: formData.house_id
        }).then(response => {
          queryClient.invalidateQueries()
          document.getElementById("cm-" + router.query.family_id).innerText = ' '
        }).catch(error => {
          document.getElementById("cm-" + router.query.family_id).innerText = error.response.data.message
        })
      } else {
        document.getElementById("cm-" + router.query.family_id).innerText = 'CustomError: The Person field is required'
      }
    }

    if (isLoading) return (
      <div>
        <h2 className="text-2xl leading-snug my-4 mx-0">Travel Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <BoxLayoutSingle>
          <Container>
            <h2 className="text-2xl leading-snug my-4 mx-0">Travel Info</h2>
            {
              data.family_people.length > 0 ? 
                data.family_people.map(({ person_name, person_house_id, person_house }) => (
                  person_house_id ? <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                    <span className='whitespace-nowrap'>{person_name} lives at {person_house.house_address.house_address_number + " " + person_house.house_address.house_address_road.house_road_name}.</span>
                  </div> : <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <MapPinIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                    <span className='whitespace-nowrap'>{person_name} is unhoused.</span>
                  </div>
                ))
              :
                <p className="m-2 text-gray-500 dark:text-gray-400">This family does not have any people in it.</p>
            }
          </Container>
          <Container>
            <h2 className="text-2xl leading-snug my-4 mx-0">Manage Travel</h2>
            {
              data.family_people.length > 0 && data.family_houses.length > 0 ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <select {...register("person_id", { required: true })} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        { errors.person_id ? document.getElementById("cm-" + router.query.family_id).innerText = "The Person field is required" : null }
                        { data.family_people.map(({ person_id, person_name }) => (
                          <option value={person_id}>{person_name}</option>
                        ))}
                        </select>
                      </div>
                      <div>
                        <select {...register("house_id")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                        { data.family_houses.map(({ house_id, house_address }) => (
                          <option value={house_id}>{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</option>
                        ))}
                        </select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                  <small className="text-stone-500" id={'cm-' + router.query.family_id}></small>
                </div>
              :
                <div>
                  <p>This family has {data.family_people.length} people and {data.family_houses.length} houses but both must be above 0.</p>
                </div>
            }
          </Container>
        </BoxLayoutSingle>
      )
    } else {
      router.push('/')
    }
  }
}