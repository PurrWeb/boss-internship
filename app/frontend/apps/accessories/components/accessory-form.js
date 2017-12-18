import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';

import {
  BossFormInput,
  BossFormCheckbox,
  BossFormTagInput,
} from '~/components/boss-form';

import BossFormSelect from './boss-form-select';

import * as constants from './constants';

class AccessoryForm extends React.Component {

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form boss-form">
        <Field
          name="name"
          label="Name"
          component={BossFormInput}
        />
        <Field
          name="accessoryType"
          label="Accessory type"
          placeholder="Select accessory type ..."
          options={constants.ACCESSORY_SELECT_TYPES}
          component={BossFormSelect}
        />
        <Field
          name="priceCents"
          label="Price"
          unit="£"
          isCurrency
          type="number"
          component={BossFormInput}
        />
        {this.props.isUniformType &&
          <Field
            name="size"
            label="Size"
            placeholder="Select size ..."
            component={BossFormTagInput}
          />
        }
        <Field
          name="userRequestable"
          label="Self requestable"
          type="checkbox"
          component={BossFormCheckbox}
        />
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

AccessoryForm.propTypes = {
}

AccessoryForm.defaultProps = {
  buttonClass: 'boss-button_role_add',
  buttonText: 'Add Accessory',
}

AccessoryForm = reduxForm({
  values: ['id'],
  form: 'accessory-form',
})(AccessoryForm);

const selector = formValueSelector('accessory-form')

export default connect(state => {
  const accessoryType = selector(state, 'accessoryType');
  return {
    isUniformType: accessoryType === constants.UNIFORM_TYPE,
  }
})(AccessoryForm)
