import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { PostEntity } from './entity/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        private readonly uploadFileService: UploadFileService
    ) {}

    async getAllPosts(queries) {
        let { page, limit, categories, author } = queries;

        limit = limit ? +limit : 10;
        page = page ? +page : 1;

        const query = await this.postRepository
            .createQueryBuilder('post')
            // .leftJoinAndSelect('post.categories', 'categories')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.uploadFiles', 'uploadFiles')
            .select(['post.id', 'post.content', 'post.published', 'post.updatedAt', 'post.createdAt', 'uploadFiles.Location', 'author.firstName', 'author.lastName'])


        // if(categories !== undefined) {
        //     query
        //         .where('categories.name IN (:...categories)', { categories: categories.split(',') })
        // }
        
        if(author !== undefined) {
            query
                .where('author.id = :author', { author })
        }

        const postList = query
                            .limit(limit)
                            .offset((page - 1) * limit)
                            .orderBy('post.id', 'DESC')
                            .getMany();

        return postList;
    }
    async getOnePostById(id: number) {
        const post = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.categories', 'categories')
            .leftJoinAndSelect('post.user', 'user')
            .select(['post.id', 'post.title', 'post.description', 'post.city', 'post.published', 'post.updatedAt', 'post.createdAt', 'user.firstName', 'user.lastName', 'categories.name', 'categories.id', 'comments.id', 'comments.content', 'comments.createdAt','comments.updatedAt', 'comments.deletedAt'])
            .where('post.id = :id', { id })
            .orderBy('comments.id', 'DESC')
            .getOne();

        return post;
    }
    
    async createPost(data: PostCreateDto, user, files) {
        console.log('files', files);
        
        if (files !== undefined) {
            let filesData = await Promise.all(files.map(async file => {
                const uploadFile = await this.uploadFileService.create(file, user);
                return uploadFile;
            }));
        
            console.log('filesData', filesData);
            data.uploadFiles = filesData;
        }
        
        try {
            data.userId = +user.id;
            return await this.postRepository.save(data);
        } catch (error) {
            console.log(error);
            return error['detail'];
        }
    }
    async updatePost(id: number, data: PostUpdateDto) {
        const post = await this.postRepository.findOneBy({ id });
        const postUpdate = { ...post, ...data };
        await this.postRepository.save(postUpdate);

        return postUpdate;
    }
    async softDeletePost(id: number) {
        return await this.postRepository.softDelete(id);
    }
}
