import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import oFetch from 'o-fetch';
import BossFormSelect from './boss-form-select';

import * as constants from './constants';

class NewAccessoryRequestForm extends React.Component {

  render() {
    const {
      allAccessories,
      accessoryType,
      accessoryId,
    } = this.props;

    const accessories = allAccessories.filter(item => item.accessoryType === accessoryType);
    const selectedAccessory = accessories
      .find(item => item.id === accessoryId)
    let accessorySizes = [];
    if (selectedAccessory !== undefined) {
      accessorySizes = oFetch(selectedAccessory, 'size')
      if (accessorySizes) {
        accessorySizes = accessorySizes.split(',')
        .map(size => ({value: size, label: size}));
      }
    }

    return (
      <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form boss-form">
        <Field
          name="accessoryType"
          label="Accessory type"
          placeholder="Select accessory type ..."
          options={constants.ACCESSORY_SELECT_TYPES}
          component={BossFormSelect}
        />
        <Field
          name="accessoryId"
          label="Name"
          placeholder="Select accessory name ..."
          options={accessories}
          labelKey="name"
          valueKey="id"
          clearable
          component={BossFormSelect}
        />
        {this.props.isUniformType && accessorySizes.length > 0 &&
          <Field
            name="size"
            label="Size"
            placeholder="Select size ..."
            options={accessorySizes}
            component={BossFormSelect}
          />
        }
        <div className="boss-form__field">
          <button
            disabled={this.props.submitting}
            className={`boss-button boss-form__submit ${this.props.buttonClass}`}
          >{this.props.buttonText}</button>
        </div>
      </form>
    )
  }
}

NewAccessoryRequestForm.propTypes = {
}

NewAccessoryRequestForm.defaultProps = {
  buttonClass: 'boss-button_role_add',
  buttonText: 'Add Accessory',
}

NewAccessoryRequestForm = reduxForm({
  values: ['id'],
  form: 'new-accessory-request-form',
})(NewAccessoryRequestForm);

const selector = formValueSelector('new-accessory-request-form')

export default connect(state => {
  const accessoryType = selector(state, 'accessoryType');
  const accessoryId = selector(state, 'accessoryId');

  return {
    accessoryType: accessoryType,
    accessoryId: accessoryId,
    isUniformType: accessoryType === constants.UNIFORM_TYPE
  }
})(NewAccessoryRequestForm)
