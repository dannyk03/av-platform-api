import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/avo-local';

export const getDb = async () => {
  const client: any = await MongoClient.connect(MONGO_URL);
  return client.db();
};
