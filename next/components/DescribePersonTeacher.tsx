import { useRouter } from 'next/router'
import { useQuery, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { ChurchIcon } from "../@/components/ui/icon"
import { PersonListing, PersonInfo } from '../@/components/component/person'

export default function DescribePersonTeacher({ userId, queryClient }) {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['DescribePersonTeacherData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.person_id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <div>
        <h2 className="text-2xl leading-snug my-4 mx-0">Betrothal Info</h2>
        <p>Loading...</p>
      </div>
    )
    if (error) return <div>Failed to load</div>

    return (
      <QueryClientProvider client={queryClient}>
        <BoxLayoutSingle>
          {
            data.person_teacher_id ? <>
              <PersonTeacherInfo data={data} />
            </> : <>
              <ListPersonEligibleTeachers data={data} queryClient={queryClient} />
              <SelectPersonTeacher data={data} queryClient={queryClient} personId={router.query.person_id} />
            </>
          }
        </BoxLayoutSingle>
      </QueryClientProvider>
    )
  }
}

function ListPersonEligibleTeachers({ data, queryClient }) {
  const filteredList = data.person_family.family_people.filter(
    p => p.person_house_id == data.person_house_id && p.person_id != data.person_id
  )
  return (
    <Container>
      <PersonListing personData={filteredList} familyName={data.person_family.family_name} queryClient={queryClient} />
    </Container>
  )
}

function PersonTeacherInfo({ data }) {
  return (
    <Container>
      <PersonInfo title="Teacher" personInfo={data.person_teacher} />
    </Container>
  )
}

function SelectPersonTeacher({ data, queryClient, personId }) {
  const filteredList = data.person_family.family_people.filter(
    p => p.person_house_id == data.person_house_id && p.person_id != data.person_id
  )
  
  type Inputs = {
    person_teacher_id: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.patch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + personId, {
      person_teacher_id: formData.person_teacher_id
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + personId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + personId).innerText = error.toString()
    })
  }

  return (
    <Container>
      <h2 className="p-6 text-4xl">Select Teacher</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <select {...register("person_teacher_id")} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
            {
              filteredList.map(({ person_id, person_name }) => (
                <option value={person_id}>{person_name}</option>
              ))
            }
          </select>{ errors.person_teacher_id && <span className='whitespace-nowrap'>This field is required</span> }
          <Button
            size="sm"
            variant="ghost"
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 border-2 hover:text-gray-800 m-1 transition-colors"
          >Select Teacher</Button>
        </div>
      </form>
      <small className="" id={'cm-' + personId}></small>
    </Container>
  )
}
