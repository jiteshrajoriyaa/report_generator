const express = require('express')
const authRouter = require('./auth/auth')
const generatorRouter = require('./report_generator/report_generator')
const app = express()
const cors = require('cors')
const path = require('path')

app.use(express.json())
app.use(cors())
app.use("/reports", express.static(path.join(__dirname, "reports")));

app.use('/', authRouter)
app.use('/', generatorRouter)

app.listen(3000, ()=>{
    console.log(`Server is running on PORT: 3000`)
})