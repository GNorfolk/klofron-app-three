import { GetServerSideProps } from 'next';
import Link from 'next/link'
import styles from '../../styles/healthcheck.module.css'

export default function Backend({ backend }: { backend: {message: string }}) {
  return(
    <div className={styles.container}>
      <h2 className={styles.headingLg}>Health Check</h2>
      <p>Health check: {backend.message}</p>
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  )
}

// Export the getServerSideProps function with GetServerSideProps type
export const getServerSideProps: GetServerSideProps<{
  backend: {message: string };
}> = async (context) => {
  const res = await fetch("http://localhost:3001/api/health-check")
  const data = await res.json();
  let backend:{message: string};
  if (data == null) {
    backend = { message: "frontend response" }
  } else {
    backend = { message: data }
  }
    return {
      props: {
        backend
      }
    }
}