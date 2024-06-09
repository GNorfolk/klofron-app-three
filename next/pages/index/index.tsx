import Link from 'next/link'
import { BaseLayout } from '../../@/components/component/base-layout'
import styles from '../../styles/main.module.css'
import { QueryClientProvider } from '@tanstack/react-query'
import ListAllEntities from '../../components/ListAllEntities'
import { BoxLayout } from '../../@/components/component/box-layout'

export default function Family({ client }) {
  return (
    <BaseLayout>
      {/* <QueryClientProvider client={client}>
        <ListAllEntities queryClient={client} />

      </QueryClientProvider>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div> */}
      <BoxLayout />
    </BaseLayout>
  )
}
