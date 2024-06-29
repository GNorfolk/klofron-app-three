import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClientProvider } from '@tanstack/react-query'
import ListAllEntities from '../../components/ListAllEntities'

export default function Family({ client }) {
  return (
    <>
      <QueryClientProvider client={client}>
        <ListAllEntities queryClient={client} />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </>
  )
}
