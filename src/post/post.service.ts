import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { PostUpdateDto } from './dto/post-update.dto';
import { PostEntity } from './entity/post.entity';
import { CityService } from 'src/city/city.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
        private readonly uploadFileService: UploadFileService,
        private readonly CityService: CityService,
    ) {}

    async getAllPosts(queries) {
        let { page, limit, author, search } = queries;
        
        limit = limit ? +limit : 10;
        page = page ? +page : 1;

        const query = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('author.userDetail', 'userdetail')
            .leftJoinAndSelect('post.cities', 'cities')
            .leftJoinAndSelect('post.skills', 'skills')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.uploadFiles', 'uploadFiles')
            .leftJoinAndSelect('userdetail.personalPicture', 'personalpicture')
            .select([
                'post.id', 'post.updatedAt', 'post.createdAt', 'post.published', 'post.content',
                'comments.id', 'comments.content', 'comments.user', 'comments.createdAt', 'comments.updatedAt',
                'skills.id', 'skills.name',
                'cities.id', 'cities.name',
                'uploadFiles.Location',
                'author.id', 'author.email', 'author.firstName', 'author.lastName',
                'userdetail.id', 'userdetail.profilComplet', 'userdetail.displayedOnFeed',
                'personalpicture.id', 'personalpicture.Location'
            ])
            
        // if(categories !== undefined) {
        //     query
        //         .where('categories.name IN (:...categories)', { categories: categories.split(',') })
        // }

        if(search !== undefined) {
            query
                .where('post.content ILIKE :search', { search: `%${search}%` })
                .orWhere('skills.name ILIKE :search', { search: `%${search}%` })
                .orWhere('cities.name ILIKE :search', { search: `%${search}%` })
        }

        if(author !== undefined) {
            query
                .where('author.id = :author', { author })
        }

        const postList = await query
                            .take(limit)
                            .skip((page - 1) * limit)
                            .orderBy('post.id', 'DESC')
                            .getMany();

        // example of api request: http://localhost:3000/posts?limit=2&page=1&author=1
        if(postList.length === null) throw new NotFoundException('Pas de résultats')
        return postList;
    }
    async getOnePostById(id: number) {
        const post = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('author.userDetail', 'userdetail')
            .leftJoinAndSelect('post.skills', 'skills')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.cities', 'cities')
            .leftJoinAndSelect('post.uploadFiles', 'uploadFiles')
            .leftJoinAndSelect('userdetail.personalPicture', 'personalpicture')
            .select([
                'post.id', 'post.updatedAt', 'post.createdAt', 'post.published', 'post.content',
                'comments.id', 'comments.content', 'comments.user', 'comments.createdAt', 'comments.updatedAt',
                'skills.id', 'skills.name',
                'cities.id', 'cities.name',
                'uploadFiles.Location',
                'author.id', 'author.email', 'author.firstName', 'author.lastName',
                'userdetail.id', 'userdetail.profilComplet', 'userdetail.displayedOnFeed',
                'personalpicture.id', 'personalpicture.Location'
            ])
            .where('post.id = :id', { id })
            // .orderBy('comments.id', 'DESC')
            .getOne();

        return post;
    }
    
    async createPost(data: PostCreateDto, user, files) {
        if (files !== undefined) {
            let filesData = await Promise.all(files.map(async file => {
                const uploadFile = await this.uploadFileService.create(file, user);
                return uploadFile;
            }));
        
            // console.log('filesData', filesData);
            data.uploadFiles = filesData;
        }

        if(data.cities){
            let cities = data.cities
            if(typeof data.cities !== 'object') {
                cities = JSON.parse(data.cities);
                data.cities = cities;
            }

            await Promise.all(cities.map(async (city, index) => {
                const cityData = await this.CityService.findAll({name: city.name});
            
                if(cityData[0]?.name === city.name){
                    const id = cityData[0].id;
                    data.cities[index] = {"id": id};
                }
            }));
        }
        
        try {
            data.userId = +user.id;
            data.author = user;
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

        if(data.cities){
            let cities = JSON.parse(data.cities);
            data.cities = cities;

            await Promise.all(cities.map(async (city, index) => {
                const cityData = await this.CityService.findAll({name: city.name});
            
                if(cityData[0]?.name === city.name){
                    const id = cityData[0].id;
                    data.cities[index] = {"id": id};
                }
            }));
        }

        try {
            return await this.postRepository.save(postUpdate);
        } catch (error) {
            console.log(error);
            return error['detail'];
        }
    }
    async softDeletePost(id: number) {
        const getPost = await this.getOnePostById( id );

        if (!getPost) {
            throw new NotFoundException(`Le post d'id ${id} n'existe pas.`);
        }else if(getPost.deletedAt === null) {
            throw new NotFoundException(`Le post d'id ${id} a déjà été supprimé.`);
        }else{
            const postToRemove = await this.postRepository.softDelete(id);
            return { message: 'Post supprimé.', 'req': postToRemove };
        }
    }
}
