import Input from "./Input"

const PersonForm= ({ newName, newNumber, onChange, onSubmit }) => {
    return (
      <form onSubmit={onSubmit}>
      <Input name="name" value={newName} onChange={onChange} />
      <Input name="number" value={newNumber} onChange={onChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    )
}

export default PersonForm
