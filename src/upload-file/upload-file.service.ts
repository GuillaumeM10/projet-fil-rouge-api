import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    // get all UploadFile from database
    return await this.uploadFileRepository.find();
  }

  async findOne(id: number) {
    const uploadFile = await this.uploadFileRepository.findOneBy({ id })
    if(!uploadFile){
      throw new NotFoundException(`UploadFile #${id} not found`);
    }
    return uploadFile;
  }

  async findOneAws(key: string) {
    if (this.bucketName && key) {
      const params = {
        Bucket: this.bucketName,
        Key: `${key}`,
      }
      return await this.s3.getObject(params).promise()
    }else{
      throw new NotFoundException(`UploadFile #${key} not found`);
    }
  }

  async update(id: number, fileData, user, newfile) {

    if (this.bucketName && id && newfile) {
      await this.remove(id)
      const file = await this.findOne(id)

      const uploadFile = await this.uploadFileAws(user, newfile[0])
      file.Key = uploadFile.Key
      file.key = uploadFile.key
      file.ETag = uploadFile.ETag
      file.Location = uploadFile.Location
      return await this.uploadFileRepository.save(file)

    }else{
      throw new NotFoundException(`UploadFile #${id} not found`);
    }
  }

  async removeFromDb(id: number) {
    if (this.bucketName && id) {
      const fileToRemove = await this.findOne(id)
      return await this.uploadFileRepository.remove(fileToRemove)
    }else{
      throw new NotFoundException(`UploadFile #${id} not found`);
    }
  }

  async remove(id: number, rmFromDb: boolean = false) {
    if (this.bucketName && id) {
      const fileToRemove = await this.findOne(id)

      const params = {
        Bucket: this.bucketName,
        Key: `${fileToRemove.Key}`,
      }
      const file = await this.s3.deleteObject(params).promise()
      rmFromDb && await this.removeFromDb(id)
      return file
    }else{
      throw new NotFoundException(`UploadFile #${id} not found`);
    }
  }
}
