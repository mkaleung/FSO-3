require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
// const cors = require('cors')
const Person = require('./models/person')

// if (process.argv.length === 5) {
//   const name = process.argv[3]
//   const number = process.argv[4]

//   const person = new Person({
//     name: name,
//     number: number,
//   })

//   person.save().then(result => {
//     console.log (`added ${name} number ${number} to phonebook`)
//     mongoose.connection.close()
//   })
// }

// Person.find({}).then(result => {

// })
// app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => 
    response.json(person))
})

const generateInfoPage = (persons) => {
  const date = new Date()

  return (
    `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>
    `
  )
}

app.get('/info', (request, response) => {
  response.send(generateInfoPage(persons))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
      console.log(person)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

// const generateId = () => {
//   const randomId = parseInt(Math.random() * 1000000)
//   console.log(randomId)
//   return randomId
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  
//To Do
  if (!body.name || !body.number) {
    return response.status(400).json({error: 'name or number missing'})
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  }) 

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })  
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})