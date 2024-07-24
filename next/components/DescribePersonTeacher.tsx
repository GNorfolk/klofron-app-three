import { useRouter } from 'next/router'
import { useQuery, QueryClientProvider, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout'
import { Container } from '../@/components/component/container'
import { Button } from "../@/components/ui/button"
import { ChurchIcon } from "../@/components/ui/icon"
import { PersonListing } from '../@/components/component/person'

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
          <ListPersonEligibleTeachers data={data} queryClient={queryClient} />
        </BoxLayoutSingle>
      </QueryClientProvider>
    )
  }
}

function ListPersonEligibleTeachers({ data, queryClient }) {
  const router = useRouter()
  if (router.isReady) {
    const filteredList = data.person_family.family_people.filter(
      p => p.person_house_id == data.person_house_id
    )
    return (
      <Container>
        <PersonListing personData={filteredList} familyName={data.person_family.family_name} queryClient={queryClient} />
      </Container>
    )
  }
}
