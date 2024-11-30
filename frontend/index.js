import express from "express"
import cors from "cors" // Import the cors package

const app = express()
const port = 3001

// Use CORS middleware
app.use(cors())
app.use(express.json()) // Middleware to parse incoming JSON request bodies

app.get("/", (req, res) => {
  res.status(200).send("Hello World!")
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
