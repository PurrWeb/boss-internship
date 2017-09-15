import React from 'react';
import { change } from 'redux-form/immutable';

export default class AddNewItemField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
  }

  onValueChange = (value) => {
    this.props.onValueChange(value);
    this.setState(state => ({value: value}))
  }

  clearValue = () => {
    this.props.onValueClear();
    this.setState(state => ({value: ''}))
  }

  onAddNew = () => {
    this.props.onAddNew(this.state.value);
    this.clearValue();
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!e.target.value) return;

      this.onAddNew();
    }
  }

  render() {
    const {
      onAddNew,
    } = this.props;

    return (
      <div className="boss-checklist__item">
        <div className="boss-checklist__control">
          <div className="boss-checklist__field">
            <input type="text"
              className="boss-checklist__text-input boss-checklist__text-input_adjust_icon"
              placeholder="Type item name here..."
              value={this.state.value}
              onKeyPress={this.handleKeyPress}
              onChange={(e) => this.onValueChange(e.target.value)}
            />
            { !!this.state.value
              && <button
                  className="boss-checklist__icon boss-checklist__icon_role_field-cancel"
                  onClick={this.clearValue}
                >Cancel</button>
            }
          </div>
          { !!this.state.value
              && <button
                  className="boss-button boss-button_type_icon boss-button_role_add boss-checklist__btn"
                  onClick={this.onAddNew}
                >Add</button>
          }
        </div>
      </div>
    )
  }
}
