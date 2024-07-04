import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { UsersIcon, HomeIcon } from '../@/components/ui/icon'
import { FamilyListing } from '../@/components/component/family-listing'

export default function ListAllFamilies({ queryClient = null, userId = null }) {
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
      <h2 className="p-6 text-4xl">Families</h2>
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
          <h2 className="p-6 text-4xl">Create Family</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue="familyName" {...register("family_name", { required: true })} />
            { errors.family_name && <span className='whitespace-nowrap'>This field is required</span> }
            <input type="submit" />
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
