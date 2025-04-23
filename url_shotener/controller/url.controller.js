// import {nanoid} from "nanoid";
// import { URL } from '../model/url.model.js'
// // const { } = require('Router');

// export default async function handleGenerateNewShortUrl(req,res)
// {
//     const body=req.body;
//     if(!body){
//         return res.status(400)
//                 .json({error:'url is reauired!'})
//     }
//     const shortID = nanoid(8);

//     await URL.create({
//         shortId:shortID,
//         redirectURL:body.url,
//         visitHistory:[],
//     });

//     return res.json({id:shortID})
    
// }


import {nanoid} from "nanoid";
import { URL } from '../model/url.model.js'
export async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;

    if (!body || !body.url) {
        return res.status(400).json({ error: 'URL is required!' });
    }

    const shortID = nanoid(8);

    try {
        // Create the new short URL
        await URL.create({
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });

        // Fetch all URLs to pass to the view
        const urls = await URL.find();

        // Render home.ejs with the newly created ID and the list of all URLs
        return res.render("home", {
            id: shortID,
            urls: urls
        });

    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


// export  async function urlRedirection(req,res){
//     const shortId = req.params.shortId;
//     const entry = await URL.findByIdAndUpdate({
//         shortId
//     },{
//         $push:{
//             visitHistory:{
//                 timestamp:Date.now()
//             },
//         },
//     })
//     res.redirect(entry.redirectURL);
// }
export async function urlRedirection(req, res) {
    try {
        const { shortID } = req.params;  // Must match schema field name

        const entry = await URL.findOneAndUpdate(
            { shortID },  // Query by shortID
            { 
                $push: { 
                    visitHistory: { 
                        timestamp: new Date()  // Using Date object
                    } 
                } 
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ error: "URL not found" });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Redirect error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function handleAnalytics(req,res) {
    // const {shortID}=req.params.shortID;
    const shortID = req.params.shortID;

    const result = await URL.findOne({shortID});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics:result.visitHistory
    })
}

export const deleteUrlByShortId = async (req, res) => {
    const { shortID } = req.params;
    console.log("Trying to delete:", shortID);

    try {
        const deleted = await URL.findOneAndDelete({ shortID });

        if (!deleted) {
            console.log("No matching document found");
            return res.status(404).json({ message: "Short URL not found" });
        }

        console.log("Deleted document:", deleted);
        return res.status(200).json({ message: "URL deleted successfully", deleted });
    } catch (error) {
        console.error("Error deleting URL:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
