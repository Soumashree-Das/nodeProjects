import express from 'express';
const router = express.Router();
import {URL} from "../model/url.model.js"

// router.get("/", (req,res) => {
//     return res.render("home",{id:null})
// })

router.get("/", async (req, res) => {
    try {
        const urls = await URL.find();  // Get all URLs from DB
        return res.render("home", { id: null, urls });  // Pass 'urls' to view
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});


export default router;
