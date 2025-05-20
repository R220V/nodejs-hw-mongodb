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
 


// import { model, Schema } from 'mongoose';

// const studentsSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     age: {
//       type: Number,
//       required: true,
//     },
//     gender: {
//       type: String,
//       required: true,
//       enum: ['male', 'female', 'other'],
//     },
//     avgMark: {
//       type: Number,
//       required: true,
//     },
//     onDuty: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );
// export const StudentsCollection = model('students', studentsSchema);