import { GetServerSideProps } from 'next';
import Link from 'next/link'
import styles from '../../styles/people.module.css'
import { getSomething } from '../../lib/people'

export default function People({ people }: { people: People}) {
  return(
    <div className={styles.container}>
      <h2 className={styles.headingLg}>People</h2>
      <ul className={styles.list}>
        {people.map(({ id, name, gender, age }) => (
          <li className={styles.listItem} key={id}>
            <p>{name} is {gender} and {age} years old.</p>
          </li>
        ))}
      </ul>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

type People = {
  id: number;
  name: string;
  gender: string;
  age: number;
}[]

export const getServerSideProps: GetServerSideProps<{ people: People }> = async (context) => {
  const people = await getSomething();
  return {
    props: {
      people
    }
  }
}