import React from 'react';

const CheckboxField = ({
    label,
    required,
    name,
    options,
    input,
    meta
  }) => (
    <div className="boss-form__field">
      <label className="boss-form__checkbox-label">
        <input
          { ...input }
          type="checkbox"
          className="boss-form__checkbox-input"
          checked={ input.value }
        />

        <span className="boss-form__checkbox-label-text">{ label }</span>
      </label>
    </div>
  );

export default CheckboxField;