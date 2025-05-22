import pinoHttp from 'pino-http';
import express from 'express';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT =  Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  
  const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({
    transport: {
      target: 'pino-pretty',
    }
  })
);

  app.get('/', (req, res) => {
    res.json({
    message: 'Hello, My World!',
  });
});

	app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: `Successfully found all contacts`, data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);   
    
	if (!contact) {
	  res.status(404).json({
      status: 400,
		  message: 'Contact not found'
	  });
	  return;
	}
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

app.use((err, req, res, next) => {
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
};