import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async create(createCommentDto: CreateCommentDto, user) {
    try{

      createCommentDto.user = user.id;
      return await this.commentRepository.save(createCommentDto);
    
    }catch(err){
      console.log(err);
      return err.detail;
    }
  }

  async findAll() {
    // only user firstName and lastName
    const comments = await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user', 'user.id = comment.userId')
            .select([
              'comment.id', 'comment.content', 'comment.deletedAt', 'comment.updatedAt', 'comment.createdAt', 
              'user.firstName', 'user.lastName'
            ])
            .orderBy('comment.id', 'DESC')
            .getMany();

        return comments;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user', 'user.id = comment.userId')
            .select([
              'comment.id', 'comment.content', 'comment.deletedAt', 'comment.updatedAt', 'comment.createdAt', 
              'user.firstName', 'user.lastName'
            ])
            .where('comment.id = :id', { id })
            .getOne();

    if(comment !== null){
      return comment;    
    }else{
      throw new NotFoundException(`Comment #${id} not found`);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);

    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`);
    }

    const commentUpdate = { ...comment, ...updateCommentDto };

    try{
      await this.commentRepository.save(commentUpdate);
    }catch(err){
      console.log(err);
      return err.detail;
    }

    return commentUpdate;
  }

  async softDelete(id: number) {
    try{
      const comment = await this.commentRepository.softDelete(id);
      if(comment.affected === 0){
        throw new NotFoundException(`Comment #${id} not found`);
      }
      return { message: "Commentaire supprimé." };
    }catch(err){
      console.log(err);
      
      throw new NotFoundException(`Comment #${id} not found`);
    }
  }
}
