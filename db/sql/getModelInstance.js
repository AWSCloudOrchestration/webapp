import { connection } from './index.js';

const getModelInstance = (modelName) => {
  return connection[modelName];
};

export default getModelInstance;
