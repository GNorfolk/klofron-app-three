import styles from '../styles/main.module.css'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ListFamilyTravel({ data }) {
  const router = useRouter()
  if (router.isReady) {
    return (
      <div>
        <h2 className={styles.headingLg}>Travel Info</h2>
        <p>Go to <Link href={`/family/${router.query.id}/travel`}>Travel Management</Link> page.</p>
      </div>
    )
  }
}