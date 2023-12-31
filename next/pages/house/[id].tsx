import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Layout from '../../components/Layout'
import DescribeHouseV2 from '../../components/DescribeHouseV2'

const queryClient = new QueryClient()

export default function House() {
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <DescribeHouseV2 />
        <DescribeHouse />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </Layout>
  )
}

function DescribeHouse() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['houseData' + router.query.id],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/v1/describe-house/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    const createPerson = useMutation({
      mutationFn: (id) => {
        return axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v1/create-person/' + id)
      },
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Failed to load</div>

    if (data.success) {
      return (
        <div>
          <ul className={styles.list}>
            {data.data.map(({ id }) => (
              <li className={styles.listItem} key={id}>
                <button onClick={
                  () => {
                    createPerson.mutate(id, { onSettled: (res) => {
                      queryClient.invalidateQueries()
                      if (!res.data.success) {
                        document.getElementById("change-me-two-" + id).innerText = res.data.error
                      } else {
                        document.getElementById("change-me-two-" + id).innerText = ' '
                      }
                    }})
                  }
                } >Create Person</button>
                <small className={styles.lightText} id={'change-me-two-' + id}></small>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <h2 className={styles.headingLg}>House Info</h2>
          <p>Backend call failed with error: {data.error}</p>
        </div>
      )
    }
  }
}