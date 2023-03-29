export type IUserInfo = {
    //用户id
    userId?: number | null
    //用户名
    nickName?: string
    //用户头像
    avatar?: string
}


export interface IUserStore {
    userInfo: IUserInfo,
    // eslint-disable-next-line no-unused-vars
    setUserInfo: (value: IUserInfo) => void
}

const userStore = (): IUserStore => {
    return {
        userInfo: {},
        setUserInfo: function (value) {
            this.userInfo = value
        }
    }
}

export default userStore