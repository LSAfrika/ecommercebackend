const express= require('express')
const app=express()
const cors=require('cors')
const mongoose = require('mongoose')
const expressuploader=require('express-fileupload')

const LocalDBconnection =`mongodb://localhost:27017/ngchat`
const PORT=process.env.PORT || 3000

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(expressuploader())

app.get('/',async(req,res)=>{

    res.send({message:'root route working'})
})

// app.use('/user',require('./routes/users.routes'))
// app.use('/products',require('./routes/products.routes'))
// app.use('/cart',require('./routes/cart.routes'))




const entry=async()=>{

  try {
console.log('app entry point');
    await mongoose.connect(LocalDBconnection, { useNewUrlParser: true,useunifiedtopology: true})
    console.log(`SERVER RUNNING ONN PORT ${PORT}`);

  } catch (error) {
    console.log(error.message);
  }

}

entry()
