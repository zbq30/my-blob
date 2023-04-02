import { useState } from "react"
import type { NextPage } from "next"
import Link from "next/link"
import { navs } from "./config"
import { useRouter } from "next/router"
import styles from './index.module.scss'
import { Button, Avatar, Dropdown, Menu, message } from "antd"
import { LoginOutlined, HomeOutlined } from '@ant-design/icons'
import { useStore } from 'store/index'
import Login from "components/Login"
import request from 'service/fetch'
import { observer } from "mobx-react-lite";

const Navbar: NextPage = () => {
  const store = useStore()
  const { userId, avatar } = store.user.userInfo
  const { pathname, push } = useRouter()
  const [isShowLogin, setIsShowLogin] = useState(false)

  //文章新建页
  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new')
    } else {
      message.warning('请先登录再发表文章哦~')
    }
  }

  //打开登录弹窗
  const handleLogin = () => {
    setIsShowLogin(true)
  }

  //关闭登录弹窗
  const handleClose = () => {
    setIsShowLogin(false)
  }

  //个人主页
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`)
  }

  //退出登录
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({})

      }
    })
  }

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined />&nbsp;个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />&nbsp;退出
        </Menu.Item>
      </Menu>
    )
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
        {
          userId ? (
            <>
              <Dropdown overlay={renderDropDownMenu()} placement='bottomLeft'>
                <Avatar src={avatar} size={32}></Avatar>
              </Dropdown>
            </>
          ) : (
            <Button type="primary" onClick={handleLogin}>登录</Button>
          )
        }
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  )
}

export default observer(Navbar)