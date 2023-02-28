import type { NextPage } from "next"
import styles from "./index.module.scss"
import { useState } from "react"


interface IProps {
    isShow: boolean;
    onClose: Function;
}

const Login = (props: IProps) => {
    console.log('props---------', props);
    const [form, setFrom] = useState({
        phone: '',
        verify: '',
    })
    console.log(setFrom);
    const handleClose = () => {

    }
    const handleGetVerityCode = () => {

    }
    const handleLogin = () => {

    }
    const handleoAuthGithub = () => {

    }
    const { isShow = false } = props
    return isShow ? (
        <div className={styles.loginArea}>
            <div className={styles.loginBox}>
                <div className={styles.loginTitle}>
                    <div>手机号登录</div>
                    <div className={styles.close} onClick={handleClose}>x</div>
                    <input name="phone" type='text' placeholder="请输入手机号" value={form.phone} />
                    <div className={styles.verifyCodeArea}>
                        <input name="verify" type='text' placeholder="请输入验证码" value={form.verify} />
                        <span className={styles.verityCode} onClick={handleGetVerityCode}>获取验证码</span>
                    </div>
                    <div className={styles.loginBtn} onClick={handleLogin}>登录</div>
                    <div className={styles.otherLogin} onClick={handleoAuthGithub}>使用 Github 登录</div>
                    <div className={styles.loginPrivacy}>
                        注册登录即表示同意
                        <a href="https://moco.imooc.com/primary.html" target='_blank' rel="noreferrer">隐私政策</a>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default Login