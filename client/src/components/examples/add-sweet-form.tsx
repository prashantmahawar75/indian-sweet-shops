import { AddSweetForm } from '../add-sweet-form'

export default function AddSweetFormExample() {
  return (
    <div className="p-4">
      <AddSweetForm
        onSubmit={(data) => console.log('Sweet form submit:', data)}
      />
    </div>
  )
}