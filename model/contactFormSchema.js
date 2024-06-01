const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the ContactForm schema
const ContactFormSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Email validation
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    
});

// Create the model from the schema
const ContactForm = mongoose.model('ContactForm', ContactFormSchema);

module.exports = ContactForm;
