import { GetServerSideProps } from 'next';
import Link from 'next/link'
import styles from '../../styles/users.module.css'
import { getSomething } from '../../lib/users'

export default function Users({ users }: { users: Users}) {
  return(
    <div className={styles.container}>
      <h2 className={styles.headingLg}>Users</h2>
      <ul className={styles.list}>
        {users.map(({ id, name, email }) => (
          <li className={styles.listItem} key={id}>
            <Link href={`/users/${id}`}>{name}</Link>: {email}
          </li>
        ))}
      </ul>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

type Users = {
  id: number;
  name: string;
  email: string;
}[]

export const getServerSideProps: GetServerSideProps<{ users: Users }> = async (context) => {
  const users = await getSomething();
  return {
    props: {
      users
    }
  }
}