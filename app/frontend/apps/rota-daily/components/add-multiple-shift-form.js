import React from 'react';
import {
  Field,
  Fields,
  reduxForm,
} from 'redux-form/immutable';
import {handleSubmit} from './add-shift';
import { scroller, Element } from 'react-scroll';

import {
  ErrorBlock,
  BossFormShiftTimeInput,
  BossFormCheckbox,
} from '~/components/boss-form';

function scrollToFirstError(errors) {
  if (errors) {
    scroller.scrollTo('multiple-rota-shift-errors', { offset: -200, smooth: true });
  }
}
class AddMultipleShiftForm extends React.Component {
  
  render() {
    const {
      handleSubmit,
      submittion,
      staffMember,
      staffType,
      shiftRotaDate,
      submitting,
      error,
    } = this.props;

    return (
      <div onSubmit={handleSubmit} className="boss-form__group boss-form__group_role_board boss-form__group_position_last">
        <Element className="boss-form__row boss-form__row_position_last boss-form__row_layout_wrap-xs" name="multiple-rota-shift-errors">
          <div className="boss-form__field_layout_max">
            <Fields
              names={['starts_at', 'ends_at']}
              component={BossFormShiftTimeInput}
              shiftRotaDate={shiftRotaDate}
            />
            { error && <ErrorBlock error={error} />}
          </div>
          <Field
            name="shift_type"
            label="Standby"
            type="checkbox"
            className="boss-form__field_layout_min"
            format={(value) => value === 'standby' ? true : false}
            normalize={(value) => value ? 'standby' : 'normal'}
            component={BossFormCheckbox}
          />  
        </Element>
      </div>
    )
  }
}

export default reduxForm({
  form: 'add-multiple-shift-form',
  onSubmit: handleSubmit,
  onSubmitFail: scrollToFirstError,
})(AddMultipleShiftForm);
