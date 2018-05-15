import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Field, Fields, reduxForm } from 'redux-form/immutable';
import getVenueColor from '~/lib/get-venue-color';
import { ErrorBlock, BossFormCheckbox, BossFormSelect } from '~/components/boss-form';
import BossFormShiftTimeInput from './boss-form-shift-time-input';
import { ColoredSingleOption, ColoredSingleValue } from '~/components/boss-form/colored-select';

class AddShiftForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submittion,
      staffMember,
      staffType,
      rotaDate,
      submitting,
      error,
      handleAfterAdd,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(submittion)} className="boss-form">
        <Field
          name="venueId"
          component={BossFormSelect}
          options={this.props.venues
            .map(v => v.set('color', getVenueColor(v.get('id').split(`_`)[1])))
            .toJS()}
          optionValue="id"
          optionLabel="name"
          multy={false}
          placeholder="Select Venue"
          label="Venue"
          clearable={false}
          optionComponent={ColoredSingleOption}
          valueComponent={ColoredSingleValue}
        />
        <Fields names={['startsAt', 'endsAt']} component={BossFormShiftTimeInput} rotaDate={rotaDate} />
        {error && <ErrorBlock error={error} />}
        <Field
          name="shiftType"
          label="Standby"
          type="checkbox"
          format={value => (value === 'standby' ? true : false)}
          normalize={value => (value ? 'standby' : 'normal')}
          component={BossFormCheckbox}
        />
        <div className="boss-form__field boss-form__field_role_controls">
          <button
            type="button"
            onClick={handleAfterAdd}
            className="boss-button boss-button_role_inactive boss-form__button_adjust_max boss-form__button_adjust_row"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="boss-button boss-button_role_add boss-form__button_adjust_max"
          >
            Add Shift Hours
          </button>
        </div>
      </form>
    );
  }
}

AddShiftForm.PropTypes = {
  submittion: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  rotaDate: PropTypes.string.isRequired,
  rotas: ImmutablePropTypes.list.isRequired,
  handleAfterAdd: PropTypes.func.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
};

export default reduxForm({
  fields: ['staffMemberId'],
  form: 'add-shift-form',
})(AddShiftForm);
