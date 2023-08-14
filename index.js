const app= require('express')()

const PORT=process.env.port ||3000
app.listen(PORT,()=>console.log(`app running on port ${PORT}`))