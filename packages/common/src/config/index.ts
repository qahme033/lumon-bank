// packages/common/src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  CORE_BANKING_API_URL: string;
  // Add other common configurations here
}

const config: Config = {
  CORE_BANKING_API_URL: process.env.CORE_BANKING_API_URL || 'http://localhost:3000/api/v1',
  // Initialize other configurations
};

export default config;
