import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayout } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { PersonListing } from '../@/components/component/person-listing'
import { HouseListing } from '../@/components/component/house-listing'
import { Button } from "../@/components/ui/button"

export default function DescribeFamily({ queryClient, userId }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['familyData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.family_user_id === userId) {
      return (
        <QueryClientProvider client={queryClient}>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tighter my-4 mx-0" key={data.family_id}>The {data.family_name} family</h1>
          <BoxLayout left={
            <div>
              <ListFamilyHouses data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={true} />
              <ListFamilyTravel data={data} />
              <ListFamilyBetrothals data={data} />
              <CreateFamilyBetrothals data={data} />
            </div>
          } right={
            <div>
              <ListFamilyPeople data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={true} />
            </div>
          }/>
        </QueryClientProvider>
      )
    } else {
      return (
        <QueryClientProvider client={queryClient}>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tighter my-4 mx-0" key={data.family_id}>The {data.family_name} family</h1>
          <BoxLayout left={
            <ListFamilyPeople data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={false} />
          } right={
            <ListFamilyHouses data={data} queryClient={queryClient} familyId={router.query.id} unnamedBoolean={false} />
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
        <h2 className="p-6 text-4xl">House Info</h2>
        <ul className="list-none p-0 m-0">
          <li className="mt-0 mx-0 mb-5">
            <p>This family does not own any houses.</p>
            {
              unnamedBoolean ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="submit" value="Create first house" />
                  </form>
                  <small className="text-stone-500" id={'cm-' + familyId}></small>
                </div>
              : null
            }
          </li>
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
        <h2 className="p-6 text-4xl">Person Info</h2>
        <ul className="list-none p-0 m-0">
          <li className="mt-0 mx-0 mb-5">
            <p>This family does not have any people in it.</p>
            {
              unnamedBoolean ?
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="submit" value="Create first couple" />
                  </form>
                  <small className="text-stone-500" id={'cm-' + familyId}></small>
                </div>
              : null
            }
          </li>
        </ul>
      </Container>
    )
  }
}

function ListFamilyBetrothals({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Container>
        <h2 className="p-6 text-4xl">Betrothal Listing</h2>
        <Button size="sm"
          variant="ghost"
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
          onClick={ () => router.push(`/family/${router.query.id}/betrothal-listing`) }
        >Go to Betrothal Listing page.</Button>
      </Container>
    )
  }
}

function CreateFamilyBetrothals({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Container>
        <h2 className="p-6 text-4xl">Betrothal Creation</h2>
        <Button size="sm"
          variant="ghost"
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
          onClick={ () => router.push(`/family/${router.query.id}/betrothal-create`) }
        >Go to Betrothal Creation page.</Button>
      </Container>
    )
  }
}

function ListFamilyTravel({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <Container>
        <h2 className="p-6 text-4xl">Travel Info</h2>
        <Button size="sm"
          variant="ghost"
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
          onClick={ () => router.push(`/family/${router.query.id}/travel`) }
        >Go to Travel Management page.</Button>
      </Container>
    )
  }
}