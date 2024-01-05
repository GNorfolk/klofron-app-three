import styles from '../styles/main.module.css'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import ListFamilyPeople from './ListFamilyPeople'
import ListFamilyHouses from './ListFamilyHouses'

export default function DescribeHouseV2({ queryClient, familyId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['familyData' + familyId],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_HOST + '/v2/family/' + familyId).then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <QueryClientProvider client={queryClient}>
      <h1 className={styles.heading2Xl} key={data.family_id}>The {data.family_name} family</h1>
      <ListFamilyPeople familyId={familyId} />
      <ListFamilyHouses familyId={familyId} />
    </QueryClientProvider>
  )
}