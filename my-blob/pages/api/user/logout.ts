import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { ISession } from "pages/api/index";
import { ironOptions } from 'config/index'
import { Cookie } from "next-cookie";
import { clearCooike } from "utils/index";

export default withIronSessionApiRoute(logout, ironOptions)

async function logout(req: NextApiRequest, res: NextApiResponse) {
    //拿到session
    const session: ISession = req.session
    //拿到cookies
    const cookies = Cookie.fromApiRoute(req, res)
    //调用destory方法把session清空
    await session.destroy()
    //调用在utils下面index.ts的clearCooike方法把相应的cookie清空
    clearCooike(cookies)

    res.status(200).json({
        code: 0,
        msg: '退出成功',
        data: {}
    })
}