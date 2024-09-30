import Link from 'next/link'
import { useQuery, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayout } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { PersonListing } from '@/components/component/person'
import { HouseListing } from '@/components/component/house'
import { GrayButton } from "@/components/ui/button"
import { HeaderOne } from "@/components/ui/header"
import { ListItem, Small } from "@/components/ui/text"

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribeFamily queryClient={client} userId={userId} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function DescribeFamily({ queryClient, userId, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyData' + router.query.family_id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.family_id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <QueryClientProvider client={queryClient}>
          {/* <h1 className="text-4xl leading-tight font-extrabold tracking-tighter my-4 mx-0" key={data.family_id}>The {data.family_name} family</h1> */}
          <BoxLayout left={
            <div>
              <ListFamilyHouses data={data} queryClient={queryClient} familyId={router.query.family_id} unnamedBoolean={true} />
              <ListFamilyTravel data={data} router={router} />
              <ListFamilyBetrothals data={data} router={router} />
              <CreateFamilyBetrothals data={data} router={router} />
            </div>
          } right={
            <div>
              <ListFamilyPeople data={data} queryClient={queryClient} familyId={router.query.family_id} unnamedBoolean={true} />
            </div>
          }/>
        </QueryClientProvider>
      )
    } else {
      return (
        <QueryClientProvider client={queryClient}>
          {/* <h1 className="text-4xl leading-tight font-extrabold tracking-tighter my-4 mx-0" key={data.family_id}>The {data.family_name} family</h1> */}
          <BoxLayout left={
            <ListFamilyPeople data={data} queryClient={queryClient} familyId={router.query.family_id} unnamedBoolean={false} />
          } right={
            <ListFamilyHouses data={data} queryClient={queryClient} familyId={router.query.family_id} unnamedBoolean={false} />
          } />
        </QueryClientProvider>
      )
    }
  }
}

function ListFamilyHouses({ data, queryClient = null, familyId, unnamedBoolean = false }) {
  type Inputs = {
    house_family_id: number
    house_rooms: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/house', {
      house_family_id: familyId,
      house_rooms: 2
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + familyId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + familyId).innerText = error.toString()
    })
  }

  if (data.family_houses.length > 0) {
    return (
      <Container>
        <HouseListing houseData={data.family_houses} />
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderOne>House Info</HeaderOne>
        <ul className="list-none p-0 m-0">
          <ListItem>
            <p>This family does not own any houses.</p>
            {
              unnamedBoolean ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="submit" value="Create first house" />
                  </form>
                  <Small uid={familyId}></Small>
                </div>
              : null
            }
          </ListItem>
        </ul>
      </Container>
    )
  }
}


function ListFamilyPeople({ data, queryClient = null, familyId, unnamedBoolean = false }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{}>()

  const onSubmit: SubmitHandler<{}> = () => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/person', [
      {
        person_gender: "female",
        person_family_id: familyId,
        person_mother_id: 2,
        person_father_id: 1
      },
      {
        person_gender: "male",
        person_family_id: familyId,
        person_mother_id: 2,
        person_father_id: 1
      }
    ]).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + familyId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + familyId).innerText = error.toString()
    })
  }

  if (data.family_people.length > 0) {
    return (
      <Container>
        <PersonListing personData={data.family_people} familyName={data.family_name} />
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderOne>Person Info</HeaderOne>
        <ul className="list-none p-0 m-0">
          <ListItem>
            <p>This family does not have any people in it.</p>
            {
              unnamedBoolean ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="submit" value="Create first couple" />
                  </form>
                  <Small uid={familyId}></Small>
                </div>
              : null
            }
          </ListItem>
        </ul>
      </Container>
    )
  }
}

function ListFamilyBetrothals({ data, router }) {
  if (router.isReady) {
    return (
      <Container>
        <HeaderOne>Betrothal Listing</HeaderOne>
        <GrayButton
          onClick={ () => router.push(`/family/${router.query.family_id}/betrothal/list`) }
          text="Go to Betrothal Listing page."
        />
      </Container>
    )
  }
}

function CreateFamilyBetrothals({ data, router }) {
  if (router.isReady) {
    return (
      <Container>
        <HeaderOne>Betrothal Creation</HeaderOne>
        <GrayButton
          onClick={ () => router.push(`/family/${router.query.family_id}/betrothal/create`) }
          text="Go to Betrothal Creation page."
        />
      </Container>
    )
  }
}

function ListFamilyTravel({ data, router }) {
  if (router.isReady) {
    return (
      <Container>
        <HeaderOne>Travel Info</HeaderOne>
        <GrayButton
          onClick={ () => router.push(`/family/${router.query.family_id}/travel`) }
          text="Go to Travel Management page."
        />
      </Container>
    )
  }
}