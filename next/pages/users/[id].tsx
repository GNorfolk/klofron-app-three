import { getAllUserIds, getUserData } from '../../lib/users'
import Link from 'next/link'
import styles from '../../styles/users.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'

export default function User({
  userData
}: {
  userData: {
    id: string
    name: string
    email: string
  }
}) {
  return (
    <div className={styles.container}>
      <h2 className={styles.headingLg}>User Info</h2>
      <Link href={`/users`}>← User List</Link>
      <p>ID: {userData.id}</p>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllUserIds()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const userData = await getUserData(params?.id as string)
  return {
    props: {
      userData
    }
  }
}