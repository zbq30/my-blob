import 'reflect-metadata'
import { Connection, getConnection, createConnection } from 'typeorm'
import { User, UserAuth, Article } from './entity/index'


const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

let connectionReadyPromise: Promise<Connection> | null = null

export const prepareConnection = () => {
    if (!connectionReadyPromise) {
        connectionReadyPromise = (async () => {
            try {
                const staleConnection = getConnection()
                await staleConnection.close()
            } catch (error) {
                console.log(error);
            }

            const connection = await createConnection({
                //需要连接的数据库类型
                type: 'mysql',
                //数据库的host
                host,
                //数据库的端口号
                port,
                //数据库的用户名
                username,
                //数据库的用户密码
                password,
                //需要连接到的数据库
                database,
                //实体
                entities: [User, UserAuth, Article],
                //
                synchronize: false,
                //日志
                logging: true,
            })

            return connection
        })()
    }

    return connectionReadyPromise
}