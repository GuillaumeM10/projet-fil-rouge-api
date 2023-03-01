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

  async create(createCommentDto: CreateCommentDto) {
    return await this.commentRepository.save(createCommentDto);
  }

  async findAll() {
    // only user firstName and lastName
    const comments = await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user', 'user.id = comment.userId')
            .select(['comment.id', 'comment.content', 'comment.deletedAt', 'comment.updatedAt', 'comment.createdAt', 'user.firstName', 'user.lastName'])
            .orderBy('comment.id', 'DESC')
            .getMany();

        return comments;
  }

  async findOne(id: number) {
    const comment = await this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user', 'user.id = comment.userId')
            .select(['comment.id', 'comment.content', 'comment.deletedAt', 'comment.updatedAt', 'comment.createdAt', 'user.firstName', 'user.lastName'])
            .where('comment.id = :id', { id })
            .getOne();

        return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);

    if (!comment) {
      throw new NotFoundException(`Comment #${id} not found`);
    }

    const commentUpdate = { ...comment, ...updateCommentDto };

    await this.commentRepository.save(commentUpdate);

    return commentUpdate;
  }

  async remove(id: number) {
    return await this.commentRepository.softDelete(id);
  }
}
