const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const web = require('./route/web')

const connectDb = require('./db/connectdb')

// fileuploader for image
const fileuploader = require('express-fileupload')

// call function of fileuploader
app.use(fileuploader({ useTempFiles: true }))



// for dataget in ap (change formate)
app.use(express.json())

connectDb()

// for connectivity to react
const cors = require('cors')

app.use(cors())


// load route
app.use('/api', web)
// Localhost:4000/api

















// server create
app.listen(process.env.PORT, () => {

    console.log(`Server Running On Localhost:${process.env.PORT}`)

})