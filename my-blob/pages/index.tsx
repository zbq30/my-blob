import { prepareConnection } from 'db/index';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import { Divider } from 'antd';
import { IArticle } from 'pages/api/index';

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  //建立数据库的连接
  const db = await prepareConnection()
  const articles = await db.getRepository(Article).find({
    //这里relations的作用是返回文章时同时也把文章关联的userid也跟着一起返回
    relations: ['user'],
  })



  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  }
}



const Home = (props: IProps) => {
  const { articles } = props
  return (
    <div>
      <div className='content-layout'>
        {articles?.map((article) => (
          <>
            <ListItem article={article} />
            <Divider></Divider>
          </>
        ))}
      </div>
    </div>
  )
}

export default Home