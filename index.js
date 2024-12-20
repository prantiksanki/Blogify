const express = require("express") ; 
const path = require("path") ; 
const app = express() ; 
const userRoute = require("./routes/user") ; 
const mongoose = require("mongoose") ; 
const cookieParser = require("cookie-parser") ;
const checkForAuthenticationCookie = require("./middleware/authentication");
const blogRoute = require("./routes/blog") ;
const Blog = require("./models/blog")

const PORT = 80 ; 

app.set("view engine" , "ejs") ;
app.set("views" , path.resolve("./views")) ; 

app.use(express.urlencoded({extended : false})) ; 
app.use(cookieParser()) ; 
app.use(checkForAuthenticationCookie("token")) ;

app.use(express.static(path.resolve("./public"))) ;     // content of public folder can serve statically

mongoose.connect("mongodb://localhost:27017/blogify")
.then(e => console.log("MongoDB is connected")) ; 

app.get("/" ,async  (req,res) =>
{
    const allBlogs = await Blog.find({}) ;
    res.render("home" , {
        user : req.user ,
        blogs: allBlogs,
    }) ; 
})


app.use("/user" , userRoute) ; 
app.use("/blog" , blogRoute) ; 





app.listen(PORT , (req , res)=>{
    console.log(`Server started at port ${PORT}`) ; 
})


