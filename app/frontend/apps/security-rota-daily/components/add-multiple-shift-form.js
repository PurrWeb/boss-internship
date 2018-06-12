import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import safeMoment from '~/lib/safe-moment';
import { Field, Fields, reduxForm } from 'redux-form/immutable';
import { handleSubmit } from './add-shift';
import { scroller, Element } from 'react-scroll';
import getVenueColor from '~/lib/get-venue-color';

import {
  ErrorBlock,
  BossFormSelect,
  BossFormCheckbox,
} from '~/components/boss-form';
import BossFormShiftTimeInput from './boss-form-shift-time-input';
import {
  ColoredSingleOption,
  ColoredSingleValue,
} from '~/components/boss-form/colored-select';

function scrollToFirstError(errors) {
  if (errors) {
    scroller.scrollTo('multiple-rota-shift-errors', {
      offset: -200,
      smooth: true,
    });
  }
}
class AddMultipleShiftForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submittion,
      staffMember,
      staffType,
      rotaDate,
      submitting,
      error,
    } = this.props;

    return (
      <div
        onSubmit={handleSubmit}
        className="boss-form__group boss-form__group_role_board boss-form__group_position_last"
      >
        <Element
          className="boss-form__row boss-form__row_position_last"
          name="multiple-rota-shift-errors"
        >
          <div className="boss-form__field_layout_max">
            <Fields
              names={['startsAt', 'endsAt']}
              component={BossFormShiftTimeInput}
              rotaDate={rotaDate}
            />
            {error && <ErrorBlock error={error} />}
          </div>
          <div className="boss-form__field boss-form__field_layout_third">
            <Field
              name="venueId"
              component={BossFormSelect}
              options={this.props.venues.map(v => v.set('color', getVenueColor(v.get('id').split(`_`)[1]))).toJS()}
              clearable={false}
              optionValue="id"
              optionLabel="name"
              multy={false}
              placeholder="Select Venue"
              label="Venue"
              optionComponent={ColoredSingleOption}
              valueComponent={ColoredSingleValue}
            />
          </div>
          <div className="boss-form__field boss-form__field_layout_min">
            <p className="boss-form__label">
              <span className="boss-form__label-text">Shift Type</span>
            </p>
            <Field
              name="shiftType"
              label="Standby"
              type="checkbox"
              className="boss-form__field_layout_min"
              format={value => (value === 'standby' ? true : false)}
              normalize={value => (value ? 'standby' : 'normal')}
              component={BossFormCheckbox}
            />
          </div>
        </Element>
      </div>
    );
  }
}

AddMultipleShiftForm.PropTypes = {
  rotaDate: PropTypes.string.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
  rotas: ImmutablePropTypes.list.isRequired,
  initialValues: PropTypes.object,
};

export default reduxForm({
  form: 'add-multiple-shift-form',
  onSubmit: handleSubmit,
  onSubmitFail: scrollToFirstError,
})(AddMultipleShiftForm);
