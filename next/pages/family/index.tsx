import Link from 'next/link'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../../@/components/component/box-layout'
import { Container } from '../../@/components/component/container'
import { FamilyListing } from '../../@/components/component/family'
import { GrayButton } from "../../@/components/ui/button"
import { HeaderOne } from "../../@/components/ui/header"

export default function Home({ client, router }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllFamilies />
      </QueryClientProvider>
      <div className="mt-12 mx-0 mb-0">
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}

export function ListAllFamilies({ queryClient = null, userId = null }) {
  const fetchQuery = userId ? '/v2/family?show_empty=true&user_id=' + userId : '/v2/family'
  const { isLoading, error, data } = useQuery({
    queryKey: ['familiesData'],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + fetchQuery).then(
        (res) => res.json(),
      ),
  })

  type Inputs = {
    family_name: string
    family_user_id: number
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/family', {
      family_name: formData.family_name,
      family_user_id: userId
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + userId).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + userId).innerText = error.toString()
    })
  }

  if (isLoading) return (
    <div>
      <HeaderOne>Families</HeaderOne>
      <p>Loading...</p>
    </div>
  )
  if (error) return <div>Failed to load</div>

  if (userId) {
    return (
      <BoxLayoutSingle>
        <Container>
          <FamilyListing familyData={data} />
        </Container>
        <Container>
          <HeaderOne>Create Family</HeaderOne>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input defaultValue="familyName" {...register("family_name", { required: true })} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" />
              { errors.family_name && <span className='whitespace-nowrap'>This field is required</span> }
              <GrayButton text="Create Family" />
            </div>
          </form>
          <small className="" id={'cm-' + userId}></small>
        </Container>
      </BoxLayoutSingle>
    )
  } else {
    return (
      <Container>
        <FamilyListing familyData={data} />
      </Container>
    )
  }
}
