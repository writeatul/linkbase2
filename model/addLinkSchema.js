const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: false
    },
    optionOption: {
        type: String,
        enum: ['Blog', 'Board', 'GameHacking', 'Hosting', 'Shop', 'Useful', 'VPN', 'Warez'],
        required: false
    },
    languageOption: {
        type: String,
        enum: [
            'Albanian', 'Arabic', 'Azerbaijan', 'Chinese', 'Croatia', 'Czech', 'Danish', 'Dutch',
            'English', 'French', 'Georgian', 'German', 'Greek', 'Indonesian', 'Italian it', 'Japanese jp',
            'Malaysian', 'N/A', 'Persian', 'Polish', 'Portuguese', 'Romanian', 'Russian', 'Serbian',
            'Spanish' , 'Thai', 'Turkish', 'Ukrainian', 'Uzbek', 'Vietnamese'
        ],
        required: false
    },
    info: {
        type: String,
        maxlength: 200
    },
    tor: {
        type: String,
        match: /(https?|\/).*/
    },
    i2p: {
        type: String
    },
    blockchain: {
        type: String
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    telegram: {
        type: String
    },
    discord: {
        type: String
    },
    paypal: {
        type: Boolean,
        default: false
    },
    creditcard: {
        type: Boolean,
        default: false
    },
    webmoney: {
        type: Boolean,
        default: false
    },
    bitcoin: {
        type: Boolean,
        default: false
    },
    location:{
        type: String,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    },
    approved: { 
        type: Boolean, 
        default: false
     },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: function() {
            if (this.expiry !== 'never') {
                return parseInt(this.expiry);
            }
            return undefined;
        }
    }
});

module.exports = mongoose.model('Link', LinkSchema);
