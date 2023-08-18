import Link from 'next/link'
import styles from '../../styles/people.module.css'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function House() {
  return (
    <div className={styles.container}>
      <QueryClientProvider client={queryClient}>
        <DescribePerson />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

function DescribePerson() {
  const router = useRouter()
  if (router.isReady) {
    const { isLoading, error, data } = useQuery({
      queryKey: ['personData'],
      queryFn: () =>
        fetch(process.env.NEXT_PUBLIC_API_HOST + '/people/describe-person/' + router.query.id).then(
          (res) => res.json(),
        ),
    })

    if (isLoading) return <div className={styles.container}>Loading...</div>
    if (error) return <div className={styles.container}>Failed to load</div>

    return (
      <div className={styles.container}>
        {/* <h1 className={utilStyles.heading2Xl}>{name}</h1> */}
        <h2 className={styles.headingLg}>Person Info</h2>
        <ul className={styles.list}>
          {data.map(({ id, name, family_name, gender, age, house_id, house_name, father_id, father_name, father_family_name, mother_id, mother_name, mother_family_name }) => (
            <li className={styles.listItem} key={id}>
              <p>{name} {family_name} is {gender} and {age} years old and lives at <Link href={"/house/" + house_id}>{house_name}</Link>.</p>
              <p>{name}'s father is <Link href={"/person/" + father_id}><a onClick={(e) => queryClient.invalidateQueries()}>{father_name + ' ' + father_family_name}</a></Link> and their mother is <Link href={"/person/" + mother_id}><a onClick={(e) => queryClient.invalidateQueries()}>{mother_name + ' ' + mother_family_name}</a></Link>.</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
