import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { MapPinIcon } from "../@/components/ui/icon"
import { HeaderTwo } from '../@/components/ui/header'
import { DivIconInfo } from '../@/components/ui/div'
import { Paragraph } from '../@/components/ui/paragraph'
import { StyledSelect } from '../@/components/ui/input'

export default function DescribeFamilyTravel({ queryClient, userId, router }) {
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
        <HeaderTwo>Travel Info</HeaderTwo>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <BoxLayoutSingle>
          <Container>
            <HeaderTwo>Travel Info</HeaderTwo>
            {
              data.family_people.length > 0 ? 
                data.family_people.map(({ person_name, person_house_id, person_house }) => (
                  person_house_id ? <DivIconInfo>
                    <MapPinIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                    <span className='whitespace-nowrap'>{person_name} lives at {person_house.house_address.house_address_number + " " + person_house.house_address.house_address_road.house_road_name}.</span>
                  </DivIconInfo> : <DivIconInfo>
                    <MapPinIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                    <span className='whitespace-nowrap'>{person_name} is unhoused.</span>
                  </DivIconInfo>
                ))
              :
                <Paragraph>This family does not have any people in it.</Paragraph>
            }
          </Container>
          <Container>
            <HeaderTwo>Manage Travel</HeaderTwo>
            {
              data.family_people.length > 0 && data.family_houses.length > 0 ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <StyledSelect {...register("person_id", { required: true })}>
                        { errors.person_id ? document.getElementById("cm-" + router.query.family_id).innerText = "The Person field is required" : null }
                        { data.family_people.map(({ person_id, person_name }) => (
                          <option value={person_id}>{person_name}</option>
                        ))}
                        </StyledSelect>
                      </div>
                      <div>
                        <StyledSelect {...register("house_id")}>
                        { data.family_houses.map(({ house_id, house_address }) => (
                          <option value={house_id}>{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</option>
                        ))}
                        </StyledSelect>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                  <small className="text-gray-500" id={'cm-' + router.query.family_id}></small>
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