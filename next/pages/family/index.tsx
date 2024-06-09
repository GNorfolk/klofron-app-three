import Link from 'next/link'
import styles from '../../styles/main.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BaseLayout } from '../../@/components/component/base-layout'
import ListAllFamilies from '../../components/ListAllFamilies'


export default function Home({ client }) {
  return (
    <BaseLayout>
      <QueryClientProvider client={client}>
        <ListAllFamilies />
      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </BaseLayout>
  )
}
