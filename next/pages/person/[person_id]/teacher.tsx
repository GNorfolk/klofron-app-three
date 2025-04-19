import Link from 'next/link'
import { useQuery, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '@/components/component/base-layout'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { BoxLayoutSingle } from '@/components/component/box-layout'
import { Container } from '@/components/component/container'
import { GrayButton } from "@/components/ui/button"
import { PersonListing, PersonInfo } from '@/components/component/person'
import { HeaderOne, HeaderTwo } from '@/components/ui/header'
import { StyledSelect } from '@/components/ui/input'
import { Paragraph, Small } from '@/components/ui/text'

export default function Main({ client, router }) {
  const { status, data } = useSession()
  const userId = data?.user ? data.user.id : null
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <DescribePersonTeacher userId={userId} queryClient={client} router={router} />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function DescribePersonTeacher({ userId, queryClient, router }) {
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['DescribePersonTeacherData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/person/' + router.query.person_id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return (
      <BoxLayoutSingle>
        <Container>
          <HeaderTwo>Betrothal Info</HeaderTwo>
          <Paragraph>Loading...</Paragraph>
        </Container>
      </BoxLayoutSingle>
    )
    if (error) return (
      <BoxLayoutSingle>
        <Container>
          <HeaderTwo>Betrothal Info</HeaderTwo>
          <Paragraph>Failed to load!</Paragraph>
        </Container>
      </BoxLayoutSingle>
    )

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

  const methods = useForm<Inputs>();

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
      <FormProvider {...methods}>
        <form className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StyledSelect fieldName="person_teacher_id" fieldRequired={true}>
              {
                filteredList.map(({ person_id, person_name }) => (
                  <option value={person_id}>{person_name}</option>
                ))
              }
            </StyledSelect>
            <GrayButton onClick={methods.handleSubmit(onSubmit)} text="Select Teacher" />
          </div>
        </form>
      </FormProvider>
      <Small uid={personId}></Small>
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

  const onSubmit: SubmitHandler<Inputs> = () => {
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
      <Small uid={personId}></Small>
    </Container>
  )
}
