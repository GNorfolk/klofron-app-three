import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ListFamilyProposals({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <div>
        <h2 className={styles.headingLg}>Proposal Info</h2>
        <p>Go to <Link href={`/family/${router.query.id}/proposal`}>Proposal Management</Link> page.</p>
      </div>
    )
  }
}