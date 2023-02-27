import type { NextPage } from "next"
import Link from "next/link"
import { navs } from "./config"
import { useRouter } from "next/router"
import styles from './index.module.scss'

const Navbar: NextPage = () => {
  const { pathname } = useRouter()



  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {
          navs?.map((navs) => (
            <Link key={navs?.label} href={navs?.value}>
              <a className={pathname === navs?.value? styles.active: ''}>{navs?.label}</a>
            </Link>
          ))
        }
      </section>
    </div>
  )
}

export default Navbar