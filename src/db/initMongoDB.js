// import mongoose from "mongoose";
// import {getEnvVar} from '../utils/getEnvVar.js';

// export const initMongoConnection = async () => {

// 	const user = getEnvVar('MONGODB_USER');
// 	const password = getEnvVar('MONGODB_PASSWORD');
// 	const url = getEnvVar('MONGODB_URL');
// 	const db = getEnvVar('MONGODB_DB');
	
// 	try{
// 	 await mongoose.connect(
//       `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=hw2-mongodb`,
//     );

// 	console.log('Mongo connection successfully established!');
//   } catch (error) {
//     console.log('Error while setting up mongo connection', error);
// 	throw error;
//   }
// };


import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
	  `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=hw2-mongodb`
    // `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
