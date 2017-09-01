import React from 'react';

export default class AddedNewItemField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: props.input.value
    }
  }

  handleSwitchToEdit = () => {
    this.setState(state => ({editing: true}));
  }

  handleValueChange = (value) => {
    this.setState(state => ({value: value}));
  }

  handleValueConfirm = () => {
    this.props.input.onChange(this.state.value);
    this.setState(state => ({editing: false}));
  }

  handleValueCancel = () => {
    this.setState(state => ({value: this.props.input.value}));
    this.setState(state => ({editing: false}));
  }

  render() {
    const {
      input,
      input: {value, onChange},
      label,
      required,
      type,
      meta: { touched, error, warning },
      meta,
      onRemove,
    } = this.props;

    return (
      <div className="boss-checklist__item">
        {
          this.state.editing
            ? <div className="boss-checklist__control">
                <div className="boss-checklist__field">
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={(e) => this.handleValueChange(e.target.value)}
                    className="boss-checklist__text-input"
                  />
                </div>
                <button
                  type="button"
                  className="boss-button boss-button_type_icon boss-button_role_confirm boss-checklist__btn"
                  onClick={() => this.handleValueConfirm()}
                >Confirm</button>
                <button
                  type="button"
                  className="boss-button boss-button_type_icon boss-button_role_cancel boss-checklist__btn"
                  onClick={this.handleValueCancel}
                >Cancel</button>
              </div>
            : <div className="boss-checklist__control">
                <p className="boss-checklist__label">
                  <span className="boss-checklist__label-text">
                    { value }
                  </span>
                </p>
                <button
                  type="button"
                  className="boss-checklist__icon boss-checklist__icon_role_edit"
                  onClick={this.handleSwitchToEdit}
                >Edit</button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="boss-checklist__icon boss-checklist__icon_role_delete"
                >Delete</button>
              </div>
        }
      </div>
    )
  }
}
