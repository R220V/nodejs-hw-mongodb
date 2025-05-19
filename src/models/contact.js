 import{model, Schema} from 'mongoose';

 const contactsSchema = new Schema({
  
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  isFavorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  contactType: {
    type: String,
    required:true,
    enum: ['work','home', 'personal'],
    default: "personal",
  },
  },
{
  timestamps: true,
},
 );

 export const ContactsCollection = model('contact', contactsSchema);
 

// Password :  MEmsIp7PN3Irrg5H