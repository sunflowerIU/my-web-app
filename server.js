const app = require('./app')
const mongoose = require('mongoose')


//connect to mongodb
const db = process.env.MONGODB_CONNECTION.replace('<password>',process.env.MONGODB_PASSWORD)
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

//for checking the error for mongodb
const dbConnection = mongoose.connection
dbConnection.on('error',()=>{
  console.log('Database error')
})
dbConnection.on('open',()=>{
    console.log(`Database connected successfully`)
})








//starting app
const port = process.env.PORT || 1000
app.listen(port, () => {
    console.log('server has started in port ' + port)
})


//handle unhandledRejection warning
process.on('unhandledRejection', error => {
    console.log('UNHANDLED REJECTION, SHUTTING DOWN..')
    console.log(error)
    server.close(() => { ///server.close will close all the pending requests, which will have access to callback, and in callback we will exit the process
        process.exit(1) //1 is for success

    })
})

//2. handle sigterm 
//this happens in heroku server, because heroku will restart our app
process.on('SIGTERM',()=>{
    console.log('SIGTERM received, shutting down gracefully✌✌')
    server.close(()=>{
        console.log('Process terminated😑😐')
    })
})
