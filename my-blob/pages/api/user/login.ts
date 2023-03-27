import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from 'config/index'
import { prepareConnection } from 'db/index'
import { User, UserAuth } from 'db/entity/index'
import { ISession } from "pages/api/index";


export default withIronSessionApiRoute(login, ironOptions)

async function login(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session
    const { phone = '', verify = '', identity_type = 'phone' } = req.body
    const db = await prepareConnection()
    //绑定数据库的UserAuth表
    const userAuthRepo = db.getRepository(UserAuth)

    if (String(session.verifyCode) === String(verify)) {
        //验证码正确，在user_auths表中查找identity_type是否有记录
        const userAuth = await userAuthRepo.findOne({
            identity_type,
            identifier: phone
        }, {
            relations: ['user']
        })

        if (userAuth) {
            //已存在的用户
            const user = userAuth.user
            const { id, nickname, avatar } = user
            session.userId = id
            session.nickname = nickname
            session.avatar = avatar
            await session.save()
            res?.status(200).json({
                code: 0, msg: '登录成功', data: {
                    userId: id,
                    nickname,
                    avatar
                }
            })
        } else {
            //新用户，自动注册
            const user = new User()
            //新用户用户名
            user.nickname = `用户_${Math.floor(Math.random() * 10000)}`
            //新用户默认头像
            user.avatar = '/images/avatar.jpg'
            //新用户工作
            user.job = '暂无'
            //新用户个人简介
            user.introduce = '暂无'


            const userAuth = new UserAuth()
            //新用户登录标识（默认为手机号）
            userAuth.identifier = phone
            //新用户登录类型
            userAuth.identity_type = identity_type
            //新用户的登录凭据（手机收到的验证码）
            userAuth.credential = session.verifyCode
            //新用户的信息
            userAuth.user = user

            const resUserAuth = await userAuthRepo.save(userAuth)
            const { user: { id, nickname, avatar } } = resUserAuth
            console.log('resUserAuth---', resUserAuth);
            session.userId = id
            session.nickname = nickname
            session.avatar = avatar
            await session.save()
            res?.status(200).json({
                code: 0, msg: '登录成功', data: {
                    userId: id,
                    nickname,
                    avatar
                }
            })
        }
    } else {
        res?.status(200).json({ code: -1, msg: '验证码错误' })
    }

}