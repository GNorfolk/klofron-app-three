// import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'
import { Container } from '../@/components/component/container'
import { UsersIcon, HouseIcon } from '../@/components/ui/icon'

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

  if (userId) { // TODO: Add empty handling like ListHousePeople
    return (
      <BoxLayoutSingle>
        <Container>
          <h2 className="p-6 text-4xl">Families</h2>
          { data.length > 0 ? data.map(({ family_id, family_name, family_people, family_houses }) => (
            <div className="p-6 pt-2 pb-2">
              <h3 className="text-xl font-semibold">The <Link href={`/family/${family_id}`}>{family_name}</Link> family</h3>
              <div className="flex">
                <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
                  <UsersIcon className="w-5 h-5 mr-2" />
                  <span>{family_people.length} members</span>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <HouseIcon className="w-5 h-5 mr-2" />
                  <span>{family_houses.length} houses</span>
                </div>
              </div>
            </div>
          )) :
            <div className="p-6 pt-2 pb-2">
              <h3 className="text-xl font-semibold">The user has no families!</h3>
            </div>
          }
        </Container>
        <br />
        <Container>
          <h2 className="p-6 text-4xl">Create Family</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue="familyName" {...register("family_name", { required: true })} />
            { errors.family_name && <span>This field is required</span> }
            <input type="submit" />
          </form>
          <small className="" id={'cm-' + userId}></small>
        </Container>
      </BoxLayoutSingle>
    )
  } else {
    return (
      <Container>
        <h2 className="p-6 text-4xl">Families</h2>
        { data.map(({ family_id, family_name, family_people, family_houses }) => (
          <div className="p-6 pt-2 pb-2">
            <h3 className="text-xl font-semibold">The <Link href={`/family/${family_id}`}>{family_name}</Link> family</h3>
            <div className="flex">
              <div className="flex items-center mt-4 mr-4 text-sm text-gray-500 dark:text-gray-400">
                <UsersIcon className="w-5 h-5 mr-2" />
                <span>{family_people.length} members</span>
              </div>
              <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                <HouseIcon className="w-5 h-5 mr-2" />
                <span>{family_houses.length} houses</span>
              </div>
            </div>
          </div>
        ))}
      </Container>
    )
  }
}
