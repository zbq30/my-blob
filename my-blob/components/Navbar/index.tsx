import { useState } from "react"
import type { NextPage } from "next"
import Link from "next/link"
import { navs } from "./config"
import { useRouter } from "next/router"
import styles from './index.module.scss'
import { Button } from "antd"
import Login from "components/Login"

const Navbar: NextPage = () => {
  const { pathname } = useRouter()
  const [isShowLogin, setIsShowLogin] = useState(false)
  const handleGotoEditorPage = () => {

  }

  const handleLogin = () => {
    setIsShowLogin(true)
  }

  const handleClose = () =>{
    setIsShowLogin(false)
  }

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>MY-BLOG</section>
      <section className={styles.linkArea}>
        {
          navs?.map((navs) => (
            <Link key={navs?.label} href={navs?.value}>
              <a className={pathname === navs?.value ? styles.active : ''}>{navs?.label}</a>
            </Link>
          ))
        }
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        <Button type="primary" onClick={handleLogin}>登录</Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  )
}

export default Navbar