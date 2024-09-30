import Link from 'next/link'
import { QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { useForm, SubmitHandler } from "react-hook-form"
import axios from 'axios'
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { HeaderTwo } from '@/components/ui/header'
import { DivIconInfo } from '@/components/ui/div'
import { Paragraph, Small } from '@/components/ui/text'
import { Form, Select } from '@/components/ui/form'

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
    <QueryClientProvider client={client}>
      <DescribeFamilyTravel queryClient={client} userId={userId} router={router} />
    </QueryClientProvider>
    <div className="mt-12 mx-0 mb-0">
      <Link href="/">← Back to home</Link>
    </div>
  </BaseLayout>
  )
}

export function DescribeFamilyTravel({ queryClient, userId, router }) {
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
      console.log("formData: " + JSON.stringify(formData));
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
                  person_house_id ? <>
                    <DivIconInfo iconType="MapPinIcon">{person_name + " lives at " + person_house.house_address.house_address_number + " " + person_house.house_address.house_address_road.house_road_name + "."}</DivIconInfo>
                  </> : <>
                    <DivIconInfo iconType="MapPinIcon">{person_name + " is unhoused."}</DivIconInfo>
                  </>
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
                  <Form<Inputs> onSubmit={[{ name: "Submit", func: onSubmit }]} styling={"grid gap-4 sm:grid-cols-2"}>
                    <Select name="person_id">
                      { data.family_people.map(({ person_id, person_name }) => (
                        <option value={person_id}>{person_name}</option>
                      ))}
                    </Select>
                    <Select name="house_id">
                      { data.family_houses.map(({ house_id, house_address }) => (
                        <option value={house_id}>{house_address.house_address_number + " " + house_address.house_address_road.house_road_name}</option>
                      ))}
                    </Select>
                  </Form>
                  <Small uid={router.query.family_id}></Small>
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