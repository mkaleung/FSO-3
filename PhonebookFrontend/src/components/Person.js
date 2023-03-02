const Person = ({ person, deletePerson}) => {
    return (
      <li>
        {person.name} {person.number}
        <button onClick={deletePerson}>Delete</button>
      </li>
    )
}

export default Person