// import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import { BoxLayoutSingle } from '../@/components/component/box-layout-single'

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
        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
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
        </div>
        <br />
        <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
          <h2 className="p-6 text-4xl">Create Family</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue="familyName" {...register("family_name", { required: true })} />
            { errors.family_name && <span>This field is required</span> }
            <input type="submit" />
          </form>
          <small className="" id={'cm-' + userId}></small>
        </div>
      </BoxLayoutSingle>
    )
  } else {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
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
      </div>
    )
  }
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function HouseIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" />
      <path d="M9 21V12H15V21" />
    </svg>
  )
}