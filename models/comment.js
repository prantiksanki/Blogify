const {Schema , model} = require("mongoose") ; 
const User = require("./user") ;
const blog = require("./blog") ;

const commentSchema = new  Schema(
    {
        content:
        {
            type : String , 
            required: true ,
        } ,
        blogId:
        {
            type : Schema.Types.ObjectId,
            ref : "blog",
        } ,
        createdBy :
        {
            type : Schema.Types.ObjectId , 
            ref : "User" ,
        }
    } ,
    {timestamps : true}
)

const comment =  model("comment" , commentSchema) ; 

module.exports = { comment };

