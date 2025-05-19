import mongoose from "mongoose";
import {getEnvVar} from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {

	const user = getEnvVar('MONGODB_USER');
	const password = getEnvVar('MONGODB_PASSWORD');
	const url = getEnvVar('MONGODB_URL');
	const db = getEnvVar('MONGODB_DB');
	
	try{
	 await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=hw2-mongodb`,
    );

	console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
	throw error;
  }
};


//mongodb+srv://<db_username>:<db_password>@hw2-mongodb.oadgvl3.mongodb.net/?retryWrites=true&w=majority&appName=hw2-mongodb

// MEmsIp7PN3Irrg5H