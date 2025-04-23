// import mongoose  from "mongoose";
// const urlSchema = new mongoose.Schema({
//     shortID:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     redirectURL:{
//         type:String,
//         required:true
//     },
//     visitHistory:[{
//         timestamp:{type:Number}
//     }]
// })

// export const URL = mongoose.model("url",urlSchema);

import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortID: {  // Note consistent uppercase 'ID'
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    visitHistory: [{
        timestamp: { 
            type: Date,  // Changed to Date type (recommended)
            default: Date.now 
        }
    }]
});

export const URL = mongoose.model("URL", urlSchema);  // Capitalized model name