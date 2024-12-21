const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const blog = require("../models/blog");
const user = require("../models/user");
const{comment} = require("../models/comment") ;

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads/"));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

// Route to render the "add blog" form
router.get("/addblog", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

// Route to handle blog submission
router.post("/", upload.single("coverImage"), async (req, res) => {
    try {
        const { title, body } = req.body;

        // Ensure that cover image exists in request
        if (!req.file) {
            return res.status(400).send("Cover image is required.");
        }

        // Create a new blog post
        const Blog = await blog.create({
            body,
            title,
            createdBy: req.user._id,  // Assuming req.user is available (authenticated)
            coverImageURL: `/uploads/${req.file.filename}`,
        });

        // Redirect to the created blog's page
        return res.redirect(`/blog/${Blog._id}`);
    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).send("An error occurred while creating the blog.");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const Blog = await blog.findById(req.params.id).populate("createdBy");
        
        if (!Blog) {
            return res.status(404).send("Blog not found.");
        }
        
        // Ensure the comment model is available
        if (!comment) {
            return res.status(500).send("Comment model not initialized.");
        }
        
        const Comments = await comment.find({ blogId: req.params.id }).populate("createdBy");
        // Find all comments associated with the blog and populate the createdBy field

        return res.render("blog", {
            user: req.user,
            Blog,
            Comments,
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).send("An error occurred while fetching the blog.");
    }
});



const Comment = require("../models/comment"); // Import comment model

router.post("/comment/:blogId", async (req, res) => {
    try {
         if (!req.body.content || !req.body.content.trim()) {
            return res.status(400).send("Comment content cannot be empty.");
        }

         if (!req.user) {
            return res.status(401).send("You must be logged in to comment.");
        }

         await comment.create({
            content: req.body.content.trim(),
            blogId: req.params.blogId,
            createdBy: req.user._id,
        });

      return res.redirect(`/blog/${req.params.blogId}`);
    } 
    catch (error) 
    {
        console.error("Error creating comment:", error);
        return res.status(500).send("An error occurred while creating the comment.");
    }
});


module.exports = router;
