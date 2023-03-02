const Input = ({ name, value, onChange }) => {
    return (
      <div>
        {name}: <input name={name} value={value} onChange={onChange} />
      </div>
    )
}

export default Input