import styles from '../styles/main.module.css'
import { signIn, signOut, useSession } from "next-auth/react"
import Head from 'next/head'

export default function Layout({ children } : { children: React.ReactNode }) {
  const { status, data } = useSession()
  return (
    <div className={styles.container}>
      <Head>
        <title>ka3</title>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.heading2Xl}>ka3</h1>
        { status === "authenticated" ? (
          <button onClick={(e) => { e.preventDefault(); signOut() }}>Logout</button>
        ) : (
          <button onClick={(e) => { e.preventDefault(); signIn() }}>Login</button>
        )}
      </header>
      <main>{children}</main>
    </div>
  )
}