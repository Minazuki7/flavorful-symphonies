export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}
