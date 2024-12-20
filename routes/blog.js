const {Router} = require("express") ;
const router = Router() ; 
const multer = require("multer") ; 
const path = require("path") ; 
const blog = require("../models/blog") ;

const storege = multer.diskStorage({
    destination : function(req,file , cb)
    {
        cb(null , path.resolve(`./public/uploads/`))
    } ,

    filename : function (req,file, cb)
    {
        const fileName = `${Date.now()}-${file.originalname}` ; 
        cb(null , fileName)
    }
})

router.get("/addblog" , (req,res) =>
{
    return res.render("addBlog",{
        user: req.user,
    })
}) ;

const upload = multer({storage : storege}) ;
    
router.post("/" ,upload.single("coverImage"), async (req,res) =>
{
    const {title , body} = req.body ; 
    const Blog = await blog.create({
        body ,
        title ,
        createdBy: req.user._id ,
        coverImageURL :`/uploads/${req.file.filename}`,
    }) ;
    return res.redirect(`/blog/${blog._id}`) ;  
})


module.exports = router ;