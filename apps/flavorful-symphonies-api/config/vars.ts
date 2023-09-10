import config from './env';

export const port = config.PORT;
export const mongoUri = config.MONGO_URI as string;
