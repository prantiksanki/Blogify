const {Router } = require("express") ; 
const User = require('../models/user') ; 
const { cache } = require("ejs");



const router = Router() ; 

router.get("/signin" , (req,res) =>
{
    return res.render("signin") ; 
}) ; 


router.get("/signup" , (req,res)=>
{
    return res.render("signup") ; 
} )

router.post("/signup" , async (req,res) =>
{
    try{

        const {fullName , email , password} = req.body ; 
    await User.create(
        {
            fullName , 
            email,
            password,
        }
    ) ; 

    return res.redirect("/") ; 
    }

    catch(err)
    {
        return res.render("signup" , {
            error : "Email already exists",
        }) ;
    }
    
})  ;


router.post("/signin" , async (req,res) =>
{

try
{
    const {email, password} = req.body ; 
const token = await User.matchPasswordAndGenerateToken(email , password) ; 

return res.cookie("token" , token).redirect("/") ;

}
catch(error){

    return res.render("signin" , {
        error : "Incorrect Email or Password",
    }) ; 
}

})


router.get("/logout" , (req,res) =>
{
    res.clearCookie("token").redirect("/");
}) ; 



module.exports = router  ; 
