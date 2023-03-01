export class PostCreateDto {
  title: string;
  description?: string;
  city?: string;
  categories?: Array<any>;
  published?: boolean;
  userId?: number;
}