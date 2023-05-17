import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { ReplyEntity } from './entities/reply.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly replyRepository: Repository<ReplyEntity>
  ) {}

  async create(createReplyDto: CreateReplyDto, user) {
    try {

      createReplyDto.author = user.id;
      return await this.replyRepository.save(createReplyDto);
      
    } catch (err) {
      console.log(err);
      return err.detail;
    }

  }

  async findAll() {
    const replies = await this.replyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.author', 'author', 'author.id = reply.authorId')
      .leftJoinAndSelect('reply.comment', 'comment', 'comment.id = reply.commentId')
      .select(['reply.id', 'reply.content', 'reply.createdAt', 'author.firstName', 'author.lastName', 'comment.id'])
      .orderBy('reply.id', 'DESC')
      .getMany();

    return replies;
  }

  async findOne(id: number) {
    const reply = await this.replyRepository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.author', 'author', 'author.id = reply.authorId')
      .leftJoinAndSelect('reply.comment', 'comment', 'comment.id = reply.commentId')
      .select(['reply.id', 'reply.content', 'reply.createdAt', 'author.firstName', 'author.lastName', 'comment.id'])
      .where('reply.id = :id', { id })
      .getOne();

    if (reply !== null) {
      return reply;
    } else {
      throw new NotFoundException(`Reply #${id} not found`);
    }
  }

  async update(id: number, updateReplyDto: UpdateReplyDto) {
    const reply = await this.findOne(id);

    if (!reply) {
      throw new NotFoundException(`Reply #${id} not found`);
    }

    return await this.replyRepository.save({
      ...reply,
      ...updateReplyDto,
    });
  }

  async softDelete(id: number) {
    try{
      const reply = await this.replyRepository.softDelete(id);

      if (reply.affected === 0) {
        throw new NotFoundException(`Reply #${id} not found`);
      }

      return { message : `Commentaire supprimé.` };
    }catch(err){
      console.log(err);
      throw new NotFoundException(`Reply #${id} not found`);
    }
  }
}
