import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import { Repository } from 'typeorm';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { UploadFileEntity } from './entities/upload-file.entity';

@Injectable()
export class UploadFileService {
    private s3
    private bucketName

    constructor(
        @InjectRepository(UploadFileEntity)
        private uploadFileRepository: Repository<UploadFileEntity>,
    ){
        this.s3 = new S3({
            region: process.env.APP_AWS_BUCKET_REGION,
            accessKeyId: process.env.APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.APP_AWS_SECRET_KEY,
        })
        this.bucketName = process.env.APP_AWS_BUCKET_NAME
    }

  async create(filesData, user) {
    const file = await this.uploadFileAws(user, filesData)

    console.log(file);

    const uploadFile = await this.uploadFileRepository.create(file)
    return await this.uploadFileRepository.save(uploadFile)
  }

  async uploadFileAws(user, fileData){
    const fileName = `${Date.now()}.${fileData.originalname.split('.').pop()}`
    
    const uploadParams = {
        Bucket: this.bucketName,
        Body: fileData.buffer,
        Key: `${user.id}/${fileName}`,
    }

    return this.s3.upload(uploadParams).promise()
  }

  findAll() {
    return `This action returns all uploadFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadFile`;
  }

  update(id: number, updateUploadFileDto: UpdateUploadFileDto) {
    return `This action updates a #${id} uploadFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploadFile`;
  }
}
