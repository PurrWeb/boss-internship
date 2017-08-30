import React from 'react';

export default function ChecklistNameField({
  input,
  label,
  required,
  type,
  onNameEnterPress,
  meta: { touched, error, warning },
  meta,
}) {
  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onNameEnterPress();
    }
  }

  return (
    <div className="boss-board__field">
      <input
        onKeyPress={(e) => handleEnterPress(e)}
        {...input}
        type="text"
        placeholder="Type checklist name here..."
      />
      {
        touched && error &&
          <div className="boss-alert" style={{marginTop: '20px'}}>
            <p className="boss-alert__text"><strong>Checklist name: </strong>{error.join(', ')}</p>
          </div>
      }
    </div>
  )
}
