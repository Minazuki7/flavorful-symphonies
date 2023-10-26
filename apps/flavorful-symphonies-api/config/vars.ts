import config from './env';

export const port = config.PORT;
export const mongoUri = config.MONGO_URI as string;
export const accessSecret = config.JWT_SECRET as string;
export const jwt_expiration = config.JWT_EXPIRATION_TIME_MIN as number;
