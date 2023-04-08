import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user'
import { Article } from './article'

@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    title!: string;

    @Column()
    icon!: string;

    @Column()
    follow_count!: number;

    @Column()
    article_count!: number;

    @ManyToMany(() => User, {
        //这里设置为true的作用是保存标签的时候也会把用户关系保存
        cascade: true
    })
    //关联表
    @JoinTable({
        //关联表的名字
        name: 'tags_users_rel',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'user_id'
        }
    })
    users!: User[]

    @ManyToMany(() => Article, (article) => article.tags)
    @JoinTable({
        name: 'articles_tags_rel',
        joinColumn: {
            name: 'tag_id'
        },
        inverseJoinColumn: {
            name: 'article_id'
        }
    })
    articles!: Article[]
}