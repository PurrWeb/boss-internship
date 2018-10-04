/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import BossDatePicker from '../../../components/react-dates/boss-date-picker';
import * as Select from 'react-select';
// tslint:disable-next-line:no-require-imports

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, VenueFormFields} from '../../../interfaces/store-models';
import {setInputClass, renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import {OptionData} from '../../../interfaces/common-data-types';
import venuesInfoBlockValidated from '../../../action-creators/venues-info-block-validated';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import {OfType} from '../../../interfaces/index';
import SelectControl from './select-control';
import {MainVenueValidators} from '../../../interfaces/forms';
import {isNotEmptyInput, mustBeBlank, otherVenuesDontContainMainVenue} from '../../../helpers/index';
import {isRequiredField, mustBeBlankForSecurityStaff, isOtherVenuesDontContainMainVenue} from '../../../constants/form-errors';
import {VenueForm} from '../../../reducers/forms';
import {hasFormUnfilledRequiredFields, hasFormValidationErrors} from '../../../helpers/validators';
import changingStepInfo from '../../../action-creators/changing-step-info';

import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import changeStep from '../../../action-creators/current-step-changed';

interface Props {
}

interface MappedProps {
  readonly venueOptions: Select.Option[];
  readonly isSecurity: () => boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = () => {
    this.props.dispatch(changeStep('formsData.venueForm', ADD_STAFF_MEMBER_STEPS.VenuesBlock + 1));
  };

  handleFormUpdate = (formModelData: VenueForm) => {
    const visited = true;
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<VenueForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<VenueForm>(formModelData);
    const action = changingStepInfo('VenuesBlock', visited, hasUnfilledRequiredFields, hasValidationErrors);

    this.props.dispatch(action);
  };
  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(changeStep('formsData.venueForm', ADD_STAFF_MEMBER_STEPS.VenuesBlock - 1));
  };

  mainVenueFormValidator() {
    if (this.props.isSecurity()) {
      return {
       isFilled: mustBeBlank
      };
    } else {
      return {
        isFilled: isNotEmptyInput
      };
    }
  }

  mainVenueErrorMessage() {
    if (this.props.isSecurity()) {
      return {
        isFilled: mustBeBlankForSecurityStaff
      };
    } else {
      return {
        isFilled: isRequiredField
      };
    }
  }

  static getVenueOptions(venues: OptionData[]) {
    return venues.map((venueValue) => ({value: venueValue.id, label: venueValue.name}));
  }

  render() {
    return (
      <div className="boss-forms-block">
        <Form
          model="formsData.venueForm"
          className="boss-form"
          onUpdate={this.handleFormUpdate}
          validators={{
            '': {
                  isValidVenue: otherVenuesDontContainMainVenue,
                },
          }}
        >
        <Errors
              model="formsData.venueForm"
              messages={{
                isValidVenue: isOtherVenuesDontContainMainVenue
              }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">Main Venue</span>
            </label>
            <div className="boss-form__select">
              <SelectControl
                className=""
                model=".mainVenue"
                options={this.props.venueOptions}
                validators={ this.mainVenueFormValidator() }
              />
            </div>

            <Errors
              model=".mainVenue"
              messages={
                this.mainVenueErrorMessage()
              }
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </div>

          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">Other Venues</span>
            </label>
            <div className="boss-form__select">
              <SelectControl
                model=".otherVenues"
                value={[]}
                className="boss-form__select"
                multi={true}
                options={this.props.venueOptions}
              />
            </div>
          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-label__text">Starts At</span>
            </label>

            <Control
              component={BossDatePicker}
              model=".startsAt"
              mapProps={{
                date: (props) => props.viewValue,
                onApply: (props) => {
                  return props.onChange;
                }
              }}
              validateOn="blur"
            />
          </div>

          <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
            <input type="button"
                   className="boss-button boss-button_role_back boss-buttons-group_adjust_button"
                   value="Back"
                   onClick={this.onBackClick}
            />
            <input type="button" onClick={this.handleFormSubmit} className="boss-button boss-button_role_submit boss-buttons-group_adjust_button" value="Continue"/>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    venueOptions: Component.getVenueOptions(state.app.venues),
    isSecurity: () => state.app.staffTypes.filter(item => item.name === 'Security')[0].id === state.formsData.workForm.staffType,
  };
};

export default connect(
  mapStateToProps
)(Component);
