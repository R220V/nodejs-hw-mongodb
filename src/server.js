// import express from 'express';
// import cors from 'cors';
// import pino from 'pino-http';
// import { getEnvVar } from './utils/getEnvVar.js';
// import {  middleware404,  middleware500 } from './middlewares/customMiddlewares.js';

// const PORT = Number(getEnvVar('PORT', '3000'));

// export const setupServer = async () => {
//   const app = express();

//   app.use(express.json());
//   app.use(cors());

//   app.use(
//     pino({
//       transport: {
//         target: 'pino-pretty',
//       },
//     }),
//   );

// //   app.get('/', (req, res) => {
// //     res.json({
// //       message: 'Hello World!',
// //     });
// //   });

// //   app.use('*', (req, res, next) => {
// //     res.status(404).json({
// //       message: 'Not found',
// //     });
// //   });

// //   app.use((err, req, res, next) => {
// //     res.status(500).json({
// //       message: 'Something went wrong',
// //       error: err.message,
// //     });
// //   });

//   app.get('/', (req, res) => {
//     res.send('Server is work');
//   });

//   app.use(middleware404);

//   app.use(middleware500);

//   app.listen(PORT, (error) => {
// 	if (error) {
//       throw error;
//     }

//     console.log(`Server is running on port ${PORT}`);
//   });

// };


// import { initMongoConnection } from './db/initMongoConnection.js';
// import { setupServer } from './server.js';

// const bootstrap = async () => {
//   await initMongoConnection();
//   setupServer();
// };

// bootstrap();

// src/index.js
// -----------------------------------------

import pinoHttp from 'pino-http';
import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllStudents, getStudentById } from './services/students.js';

const PORT =  Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  
  const app = express();

  app.get('/', (req, res) => {
    res.json({
    message: 'Hello, My World!',
  });
});

	app.get('/students', async (req, res) => {
    const students = await getAllStudents();

    res.status(200).json({
      data: students,
    });
  });

  app.get('/students/:studentId', async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);   
    
    // Відповідь, якщо контакт не знайдено
	if (!student) {
	  res.status(404).json({
		  message: 'Student not found'
	  });
	  return;
	}

	// Відповідь, якщо контакт знайдено
    res.status(200).json({
      data: student,
    });
  });


app.use(cors());
app.use(express.json());
app.use(pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss.l'
      }
    }
  })
);

 app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
};