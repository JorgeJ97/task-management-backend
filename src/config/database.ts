import mongoose, { Mongoose } from 'mongoose';
import { Logger } from '../utils/logger';
import { Singleton } from '../utils/singleton';

export interface IDatabase {
  connect(uri: string): Promise<Mongoose>;
  getConnection(): typeof mongoose;
}

@Singleton
export class Database implements IDatabase {
  private connection: Mongoose | null = null;
  private readonly logger : Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }


  public async connect(uri: string): Promise<Mongoose> {
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(uri);
      
      this.logger.info('Connected to MongoDB');
      return this.connection;
    } catch (error) {
      this.logger.error('Database connection failed:', error as Error);
      process.exit(1);
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.connection;
  }
}