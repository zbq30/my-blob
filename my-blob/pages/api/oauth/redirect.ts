import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import request from 'service/fetch';
import { setCookie } from 'utils/index';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity/index';

export default withIronSessionApiRoute(redirect, ironOptions);

// client-id：ac986ef40a5cae478a29，指的是注册的应用id
// client-secret：757e5e676ee3f3e31d992a6dbdb3d91a1abbbf9c，指的是注册应用的密码

async function redirect(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session
    //http://localhost:3000/api/oauth/redirect？code=xxxxxx
    //从github授权成功后回跳的uri会携带一个code参数
    const { code } = req?.query || {}
    console.log('code---', code);
    const githubClientID = 'ac986ef40a5cae478a29'
    const githubSecrect = '757e5e676ee3f3e31d992a6dbdb3d91a1abbbf9c'
    //该请求url包含三个参数：应用的idclient_id，应用的密码client_secret，github返回的授权码code
    //然后通过这个url再往github发送获取access_token的请求
    const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`

    //post请求
    const result = await request.post(
        url,
        {},
        {
            //这里设置headers来让接口返回json数据
            headers: {
                accapt: 'application/json'
            }
        }
    )
    console.log('请求github登录令牌响应', result);


    //从返回的结果中拿到access_token
    const { access_token } = result as any

    //再通过拿到的access_token来往github请求获取用户信息
    const githubUserInfo = await request.get('https://api.github.com/user', {
        headers: {
            accept: 'application/json',
            Authorization: `token ${access_token}`
        }
    })
    console.log('请求github第三方登录用户信息响应', githubUserInfo);

    //拿到当前的cookies
    const cookies = Cookie.fromApiRoute(req, res);
    //建立数据库连接
    const db = await prepareConnection()
    //从UserAuth表中查找相关信息，如果找不到就新建一个用户，如果找到就用UserAuth表中对应的用户信息
    const userAuth = await db.getRepository(UserAuth).findOne({
        identity_type: 'github',
        identifier: githubClientID
    }, {
        relations: ['user']
    })

    if (userAuth) {
        //如果UserAuth存在，直接从user里面获取用户信息，并且更新数据库的credential
        const user = userAuth?.user
        const { id, nickname, avatar } = user
        //在这里更新credential
        userAuth.credential = access_token
        //同时set到session里面
        session.userId = id
        session.nickname = nickname
        session.avatar = avatar
        await session.save()
        //在这里把拿到的用户信息加到当前的cookies里面，实现全局状态登录的保持
        setCookie(cookies, { id, nickname, avatar })
        //302重定向跳转到博客首页
        res.writeHead(302, {
            Location: '/'
        })
    } else {
        //创建一个新用户，包括数据库中的user表和user_auth都需要进行插入相关信息
        //login为github的用户名，avatar_url为github的头像链接
        const { login = '', avatar_url = '' } = githubUserInfo as any
        //user表
        const user = new User()
        user.nickname = login
        user.avatar = avatar_url
        //userAuth表
        const userAuth = new UserAuth
        userAuth.identity_type = 'github'
        userAuth.identifier = githubClientID
        userAuth.credential = access_token
        userAuth.user = user
        //这里不需要把user也保存的原因是在entity文件夹下的userAuth.ts文件把cascade设置为了true，这样在保存userAuth的时候会根据user_id更新到user表里面相应的那条数据
        const userAuthRepo = db.getRepository(UserAuth)
        const resUserAuth = await userAuthRepo.save(userAuth)

        const { id, nickname, avatar } = resUserAuth?.user || {}
        //同时set到session里面
        session.userId = id
        session.nickname = nickname
        session.avatar = avatar
        await session.save()
        //在这里把拿到的用户信息加到当前的cookies里面，实现全局状态登录的保持
        setCookie(cookies, { id, nickname, avatar })

        //302重定向跳转到博客首页
        res.writeHead(302, {
            Location: '/'
        })
    }
}