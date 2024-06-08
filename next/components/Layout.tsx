import styles from '../styles/main.module.css'
import { signIn, signOut, useSession } from "next-auth/react"
import Head from 'next/head'
import { BaseLayout } from '../@/components/component/base-layout'

export default function Layout({ children } : { children: React.ReactNode }) {
  // const { status, data } = useSession()
  // return (
  //   <div className={styles.container}>
  //     <Head>
  //       <title>klofron</title>
  //     </Head>
  //     <header className={styles.header}>
  //       <h1 className={styles.heading2Xl}>klofron</h1>
  //       { status === "authenticated" ? (
  //         <button onClick={(e) => { e.preventDefault(); signOut() }}>Logout</button>
  //       ) : (
  //         <button onClick={(e) => { e.preventDefault(); signIn() }}>Login</button>
  //       )}
  //     </header>
  //     <main className={styles.body}>{children}</main>
  //   </div>
  // )
  return(<BaseLayout />)
}