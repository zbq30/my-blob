import type { NextPage } from "next"
import styles from "./index.module.scss"
import CountDown from "components/CountDown";
import { ChangeEvent, useState } from "react"
import request from 'service/fetch'
import { GithubOutlined } from '@ant-design/icons';
import { message } from 'antd'



interface IProps {
    isShow: boolean;
    onClose: Function;
}

const Login = (props: IProps) => {
    console.log('props---------', props);
    const { isShow = false, onClose } = props
    const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)
    const [form, setFrom] = useState({
        phone: '',
        verify: '',
    })
    console.log(setFrom);
    const handleClose = () => {
        onClose && onClose()
        setIsShowVerifyCode(false)
    }
    const handleGetVerityCode = () => {
        if (!form?.phone) {
            message.warning('请输入手机号')
            return
        }

        request.post('./api/user/sendVerifuCode', {
            to: form?.phone,
            templateId: 1,
        }).then((res: any) => {
            if (res?.code === 0) {
                setIsShowVerifyCode(true)
            } else {
                message.error(res?.msg || '未知错误')
            }
            console.log('res', res);
        })

    }
    const handleLogin = () => {
        request.post('/api/user/login', {
            ...form,
            identity_type: 'phone',
        }).then((res: any) => {
            if (res?.code === 0) {
                //登录成功
                onClose && onClose()
            } else {
                message.error(res?.msg || '未知错误')
            }
        })
    }
    const handleoAuthGithub = () => {

    }
    const handleCountDownEnd = () => {
        setIsShowVerifyCode(false)
    }
    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { name, value } = e?.target
        setFrom({
            ...form,
            [name]: value
        })
    }

    return isShow ? (
        <div className={styles.loginArea}>
            <div className={styles.loginBox}>
                <div className={styles.loginTitle}>
                    <div>手机号登录</div>
                    <div className={styles.close} onClick={handleClose}>
                        x
                    </div>
                </div>
                <input
                    name="phone"
                    type='text'
                    placeholder="请输入手机号"
                    value={form.phone}
                    onChange={handleFormChange}
                />
                <div className={styles.verifyCodeArea}>
                    <input
                        name="verify"
                        type='text'
                        placeholder="请输入验证码"
                        value={form.verify}
                        onChange={handleFormChange}
                    />
                    <span className={styles.verifyCode} onClick={handleGetVerityCode}>
                        {isShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd} /> : '获取验证码'}
                    </span>
                </div>
                <div className={styles.loginBtn} onClick={handleLogin}>
                    登录
                </div>
                <div className={styles.otherLogin} onClick={handleoAuthGithub}>
                    <GithubOutlined />使用 Github 登录
                </div>
                <div className={styles.loginPrivacy}>
                    注册登录即表示同意
                    <a href="https://moco.imooc.com/primary.html" target='_blank' rel="noreferrer">隐私政策</a>
                </div>
            </div>
        </div>
    ) : null
}

export default Login