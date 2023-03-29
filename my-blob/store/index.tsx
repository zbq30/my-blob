import React, { createContext, ReactElement, useContext } from "react";
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite'
import createStore, { IStore } from "./rootStore";

interface IProps {
    initialValue: Record<any, any>
    children: ReactElement
}

//enableStaticRendering(true)会阻止组件重新渲染，所以这里需要根据环境来选择，如果是浏览器环境则设置为false
//如果不设置为false的话，点击退出虽然cookie和session是清掉了，但是组件并没有重新渲染，这样菜页面上看到用户还是登录态
enableStaticRendering(!process.browser)

const StoreContext = createContext({})

export const StoreProvider = ({ initialValue, children }: IProps) => {
    const store: IStore = useLocalObservable(createStore(initialValue))
    return (
        <StoreContext.Provider value={store} >{children}</StoreContext.Provider>
    )
}

export const useStore = () => {
    const store: IStore = useContext(StoreContext) as IStore
    if (!store) {
        throw new Error('数据不存在')
    }
    return store
}