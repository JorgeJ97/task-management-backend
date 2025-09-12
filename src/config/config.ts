import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL || '',
    
    
    // Auth0 
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL || '',
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || '',
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '',
};