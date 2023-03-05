import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { format } from "date-fns";
import md5 from "md5";
import { encode } from "js-base64"
import request from 'service/fetch'
import { ironOptions } from 'config/index'
import { ISession } from 'pages/api/index'


export default withIronSessionApiRoute(sendVerifyCode, ironOptions)

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
    const session: ISession = req.session
    const { to = '', templateId = 1 } = req.body
    //AppId 放在请求体
    const AppId = '2c9488768658b82f0186ab43ec361297'
    //账户ID 
    const AccountId = '2c9488768658b82f0186ab43eb161290'
    //账户授权令牌
    const AuthToken = '69a45a20fe814807ad751c6ed7f546bd'
    //时间戳
    const NowDate = format(new Date(), 'yyyyMMddHHmmss')
    //REST API验证参数 生成规则：使用md5加密（账户id+账户授权令牌+时间戳）放在请求体
    const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`)
    //验证信息，生成规则：使用Base64编码（账户id+英文冒号+时间戳）放在请求头
    const Authorization = encode(`${AccountId}:${NowDate}`)
    //验证码 放在请求体
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000
    //验证码过期时间，5代表5分钟 放在请求体
    const expireMinute = '5'
    //请求url
    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`


    // console.log('to:', to);
    // console.log('templateId:', templateId);
    // console.log('SigParameter:', SigParameter);
    // console.log('Authorization:', Authorization);
    console.log('verifyCode---', verifyCode);


    const response = await request.post(
        url,
        {
            to,
            templateId,
            appId: AppId,
            datas: [1111, expireMinute],
        },
        {
            headers: {
                Authorization
            }
        }
    )

    console.log('response---', response);

    const { statusCode, statusMsg, templateSMS } = response as any

    if (statusCode === '000000') {
        session.verifyCode = verifyCode
        await session.save()
        res.status(200).json({
            code: 0,
            msg: statusMsg,
            data: {
                templateSMS
            }
        })
    } else {
        res.status(200).json({
            code: statusCode,
            msg: statusMsg,
        })
    }


}