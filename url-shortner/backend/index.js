const http = require('http');
const mongoose = require('mongoose');
const {handleRequest}=require('./router')
const PORT = 5000;
mongoose.connect('mongodb://localhost:27017/url-shortner').then(()=> console.log('connected to mongoDB'))
.catch(err => console.error('could not connect to MongoDB',err));
const server=http.createServer((req,res)=>{
    handleRequest(req,res);
});
server.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});
