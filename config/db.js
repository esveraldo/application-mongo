if(process.env.NODE_ENV == "production"){
    module.exports = {
        mongoURI : "mongodb+srv://blogapp:esve6140@cluster0-cger9.mongodb.net/test?retryWrites=true&w=majority"
    }
}else{
    module.exports = {
        mongoURI : "mongodb://localhost/blogapp"
    }
}