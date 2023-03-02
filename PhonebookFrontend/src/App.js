import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Input from './components/Input'
import Person from './components/Person'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState([null, 'initial className'])

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPhonebook => {
        setPersons(initialPhonebook)
      })
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const personExists = persons.find(person => person.name === newName)

    if (personExists && personExists.number !== newNumber) {
      if (window.confirm(`${personExists.name} is already added to the phonebook. Do you want to replace the old number with the new one?`)) {
        const updatedNumberObject = {
          ...personExists, 
          number: newNumber
        }
          
        return phonebookService
          .update(personExists.id, updatedNumberObject)
          .then(returnedPerson => {
            setMessage([`Updated Number for ${newName}`, 'positive'])
            setTimeout(() => {
              setMessage([null, null])
            }, 5000)
            setPersons(persons.map(person => person.id !== personExists.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
      }
    } else if (personExists) {
        return alert(`${newName} is already added to the phonebook`)
      }
  
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length === 0 ? 1 : persons[persons.length-1].id +  1,
    }
    
    phonebookService
      .create(personObject)
      .then(returnedPerson => {
        setMessage([`Added ${newName}`, 'positive'])
        setTimeout(() => {
          setMessage([null, null])
        }, 5000)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {  
    let person = persons.find(person => person.id === id).name
    
    if (window.confirm(`Delete ${person}?`)) {
      phonebookService
      .removePerson(id)
      .then(response => { 
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(error => {
        setMessage([`The person ${person} was already deleted from the server`, 'negative'])
        setTimeout(() => {
          setMessage([null, null])
        }, 5000)        
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  const handleChange = (event) => {
    const inputName = event.target.name
    const newValue = event.target.value

    switch (inputName) {
      case "name":
        setNewName(newValue)
        break
      case "number":
        setNewNumber(newValue)
        break
      case "filter":
        setFilterName(newValue)
        break
      default:
        alert("ERROR IN INPUT")
    }
  }

  const contactsToShow = (filterName) => {
    if (!filterName) {
      return persons
    } else {
      return persons.filter((person) => {
        return person.name.toLowerCase().includes(filterName)
      })
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message[0]} className={message[1]} />
      <Input 
        name="filter"
        value={filterName}
        onChange={handleChange}
      />
      <h2>Add New Contact</h2>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        onChange={handleChange}
        onSubmit={addPerson} 
      />
      <h2>Numbers</h2>
      <ul>
        {contactsToShow(filterName).map(person => 
          <Person 
            key={person.name}
            person={person}
            deletePerson={() => deletePerson(person.id)}
          />
        )}
      </ul>
    </div>
  )
}

export default App