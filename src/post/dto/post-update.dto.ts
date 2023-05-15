export class PostUpdateDto {
  title?: string;
  description?: string;
  city?: string;
  categories?: Array<any>;
  published?: boolean;
  userId?: number;
  uploadFiles?: any[];
}