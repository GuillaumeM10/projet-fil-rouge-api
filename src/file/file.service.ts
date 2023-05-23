import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFileService } from 'src/upload-file/upload-file.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly uploadFileService: UploadFileService,
    private readonly userService: UserService,
  ) {}

  async create(createFileDto: CreateFileDto, user, files) {
    const userFull = await this.userService.findOne(user.id);
    createFileDto.userDetail = userFull.userDetail;
    
    if (files !== undefined) {
      let filesData = await Promise.all(files.map(async file => {
          const uploadFile = await this.uploadFileService.create(file, user);
          return uploadFile;
      }));
  
      // console.log('filesData', filesData);
      createFileDto.files = filesData;
    }
    // console.log('files', files);
    // console.log('user', userFull.userDetail.id);
    
    try{
      const file = await this.fileRepository.save(createFileDto);
      console.log('createFileDto', createFileDto);
      return file;
    }catch(err){
      console.log(err);
      return err['detail'];
    }
    
  }

  async findAll() {
    try{
      const files = await this.fileRepository.find();
      return files;
    }catch(err){
      console.log(err);
      return err['detail'];
    }
  }

  async findOne(id: number) {
    const file = await this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.userDetail', 'userDetail')
      .leftJoinAndSelect('file.files', 'files')
      .where('file.id = :id', { id })
      .getOne();

    return file;
  }

  async update(id: number, updateFileDto: UpdateFileDto, user, files) {
    return `This action updates a #${id} file`;
  }

  async softDelete(id: number, user) {
    return `This action removes a #${id} file`;
  }
}
