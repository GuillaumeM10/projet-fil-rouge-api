import { Injectable, NotFoundException } from '@nestjs/common';
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
        let { page, limit, author } = queries;

        limit = limit ? +limit : 10;
        page = page ? +page : 1;

        const query = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.skills', 'skills')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.uploadFiles', 'uploadFiles')
            .select([
                'post.id', 'post.updatedAt', 'post.createdAt', 'post.published', 'post.content',
                'comments.id', 'comments.content', 'comments.user', 'comments.createdAt', 'comments.updatedAt',
                'skills.id', 'skills.name',
                'uploadFiles.Location', 
                'author.firstName', 'author.lastName'
            ])


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
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.skills', 'skills')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.uploadFiles', 'uploadFiles')
            .select([
                'post.id', 'post.updatedAt', 'post.createdAt', 'post.published', 'post.content',
                'comments.id', 'comments.content', 'comments.user', 'comments.createdAt', 'comments.updatedAt',
                'skills.id', 'skills.name',
                'uploadFiles.Location', 
                'author.firstName', 'author.lastName'
            ])
            .where('post.id = :id', { id })
            // .orderBy('comments.id', 'DESC')
            .getOne();

        return post;
    }
    
    async createPost(data: PostCreateDto, user, files) {
        // console.log('files', files);
        
        if (files !== undefined) {
            let filesData = await Promise.all(files.map(async file => {
                const uploadFile = await this.uploadFileService.create(file, user);
                return uploadFile;
            }));
        
            // console.log('filesData', filesData);
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
    async updatePost(id: number, data: PostUpdateDto, user, files) {     
        const post = await this.postRepository.findOneBy({ id });
        const postUpdate = { ...post, ...data }

        if (!post) {
            throw new NotFoundException(`Le post d'id ${id} n'existe pas.`);
        }

        if (files !== undefined) {
            let filesData = await Promise.all(files.map(async file => {
                const uploadFile = await this.uploadFileService.create(file, user);
                return uploadFile;
            }));
            
            postUpdate.uploadFiles = filesData;
        }


        try {
            return await this.postRepository.save(postUpdate);
        } catch (error) {
            console.log(error);
            return error['detail'];
        }
    }
    async softDeletePost(id: number) {
        const postToRemove = await this.postRepository.softDelete(id);
        
        if(!postToRemove.affected) {
            throw new NotFoundException(`Le post d'id ${id} n'existe pas.`);
        }else{
            return { message: 'Post supprimé.' };
        }
    }
}
