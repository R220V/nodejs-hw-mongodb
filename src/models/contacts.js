import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        isFavourite: {
            type: Boolean,
            required: true,
            default: false,
        },
        contactType: {
            type: String,
            required: true,
            enum: ['work', 'home', 'personal'],
            default: 'personal',
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const ContactsCollection = model('contact', contactsSchema);
