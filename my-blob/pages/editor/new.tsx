import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import request from 'service/fetch'
import { Input, Button, message } from 'antd'
import { observer } from "mobx-react-lite";
import { useStore } from 'store/index'
import { useRouter } from 'next/router'


const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
)



const NewEditor = () => {
    const store = useStore()
    const { userId } = store.user.userInfo
    const { push } = useRouter()
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const handlePublish = () => {
        if (!title) {
            message.warning('请输入文章标题')
            return
        }
        request.post('./api/article/publish', {
            title,
            content
        }).then((res: any) => {
            if (res.code === 0) {
                message.success('文章发布成功')
                //文章发表成功后跳转到个人主页或者博客首页
                userId ? push(`/user/${userId}`) : push('/')
            } else {
                message.error(res?.msg || '文章发布失败')
            }
        })
    }
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e?.target?.value)
    }
    const handleContentChange = (content: any) => {
        setContent(content)
    }
    return (
        <div className={styles.container}>
            <div className={styles.operation}>
                <Input
                    className={styles.title}
                    placeholder='请输入文章标题'
                    value={title}
                    onChange={handleTitleChange}
                />
                <Button
                    className={styles.button}
                    type='primary'
                    onClick={handlePublish} >
                    发布
                </Button>
            </div>
            <MDEditor value={content} onChange={handleContentChange} height={1080} />
        </div>
    )
}

(NewEditor as any).layout = null

export default observer(NewEditor)