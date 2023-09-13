import styles from '../styles/main.module.css'
import { signIn } from "next-auth/react"
import Head from 'next/head'

const name = 'ka3'
export const siteTitle = 'ka3'

export default function Layout({ children } : { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.heading2Xl}>{name}</h1>
        <button onClick={() => { signIn() }}>Login</button>
      </header>
      <main>{children}</main>
    </div>
  )
}