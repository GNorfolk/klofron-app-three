import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import ListFamilyPeople from './ListFamilyPeople'
import ListFamilyHouses from './ListFamilyHouses'
import ListFamilyTravel from './ListFamilyTravel'

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
          <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family</h1>
          <ListFamilyPeople queryClient={queryClient} familyId={router.query.id} unnamedBoolean={true} />
          <ListFamilyHouses queryClient={queryClient} familyId={router.query.id} unnamedBoolean={true} />
          <ListFamilyTravel />
        </QueryClientProvider>
      )
    } else {
      return (
        <QueryClientProvider client={queryClient}>
          <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family</h1>
          <ListFamilyPeople queryClient={queryClient} familyId={router.query.id} unnamedBoolean={false} />
          <ListFamilyHouses queryClient={queryClient} familyId={router.query.id} unnamedBoolean={false} />
        </QueryClientProvider>
      )
    }
  }
}