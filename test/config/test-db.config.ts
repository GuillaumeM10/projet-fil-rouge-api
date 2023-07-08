import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDbConfig: TypeOrmModuleOptions = { // <--- this is the config we are writing
  type: 'postgres',
  host: process.env.TEST_POSTGRESQL_ADDON_HOST,
  port: parseInt(process.env.TEST_POSTGRESQL_ADDON_PORT),
  username: process.env.TEST_POSTGRESQL_ADDON_USER,
  password: process.env.TEST_POSTGRESQL_ADDON_PASSWORD,
  database: process.env.TEST_POSTGRESQL_ADDON_DB,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
};