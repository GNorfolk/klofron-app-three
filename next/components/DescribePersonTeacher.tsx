import { useQuery, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { GrayButton } from "../@/components/ui/button"
import { ChurchIcon } from "../@/components/ui/icon"
import { PersonListing, PersonInfo } from '../@/components/component/person'
import { HeaderOne, HeaderTwo } from '../@/components/ui/header'
import { StyledSelect } from '../@/components/ui/input'

export default function DescribePersonTeacher({ userId, queryClient, router }) {
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
        <HeaderTwo>Betrothal Info</HeaderTwo>
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
              <RemovePersonTeacher queryClient={queryClient} personId={router.query.person_id} />
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
      <HeaderOne>Select Teacher</HeaderOne>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StyledSelect {...register("person_teacher_id")}>
            {
              filteredList.map(({ person_id, person_name }) => (
                <option value={person_id}>{person_name}</option>
              ))
            }
          </StyledSelect>{ errors.person_teacher_id && <span className='whitespace-nowrap'>This field is required</span> }
          <GrayButton text="Select Teacher" />
        </div>
      </form>
      <small className="" id={'cm-' + personId}></small>
    </Container>
  )
}

function RemovePersonTeacher({ queryClient, personId }) {
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
      person_teacher_id: -1
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + personId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + personId).innerText = error.toString()
    })
  }

  return (
    <Container>
      <HeaderOne>Remove Teacher</HeaderOne>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 grid-cols-1">
          <GrayButton text="Remove Teacher" />
        </div>
      </form>
      <small className="" id={'cm-' + personId}></small>
    </Container>
  )
}
