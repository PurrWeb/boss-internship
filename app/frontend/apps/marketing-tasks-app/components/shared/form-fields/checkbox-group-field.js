import React from 'react';

export default class CheckboxGroupField extends React.Component {
  render() {
    const {
      label,
      required,
      name,
      options,
      input,
      meta
    } = this.props;

    return (
      <span>
        <p className="boss-form__label">
          <span className="boss-form__label-text">{ label }</span>
        </p>

        <div className="boss-form__row boss-form__row_layout_flow-fluid">
          {
            options.map(
              (option, index) => (
                <div className="boss-form__field boss-form__field_layout_flow-fluid" key={ index }>
                  <label className="boss-form__checkbox-label">
                    <input
                      className="boss-form__checkbox-input"
                      type="checkbox"
                      name={ `${name}[${index}]` }
                      value={ option }
                      checked={ input.value.indexOf(option) !== -1 }
                      onChange={ event => {
                        const newValue = [...input.value];

                        if (event.target.checked) {
                          newValue.push(option);
                        } else {
                          newValue.splice(newValue.indexOf(option), 1);
                        }

                        return input.onChange(newValue);
                      }}/>
                    <span className="boss-form__checkbox-label-text">{ option }</span>
                  </label>
                </div>
              )
            )
          }
        </div>
      </span>
    )
  }
}
