/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import DatePicker from 'react-datepicker';
import * as Select from 'react-select';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, VenueFormFields} from '../../../interfaces/store-models';
import {setInputClass, renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import {OptionData} from '../../../interfaces/common-data-types';
import venuesInfoBlockValidated from '../../../action-creators/venues-info-block-validated';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import {OfType} from '../../../interfaces/index';
import SelectControl from './select-control';
import {MainVenueValidators} from '../../../interfaces/forms';
import {isNotEmptyInput} from '../../../helpers/index';
import {isRequiredField} from '../../../constants/form-errors';
import {VenueForm} from '../../../reducers/forms';
import {hasFormUnfilledRequiredFields, hasFormValidationErrors} from '../../../helpers/validators';
import changingStepInfo from '../../../action-creators/changing-step-info';

interface Props {
}

interface MappedProps {
  readonly venueOptions: Select.Option[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = (formModelData: OfType<VenueFormFields, any>) => {
    const action = venuesInfoBlockValidated(formModelData);

    this.props.dispatch(action);
  };

  handleFormUpdate = (formModelData: VenueForm) => {
    const visited = true;
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<VenueForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<VenueForm>(formModelData);
    const action = changingStepInfo('VenuesBlock', visited, hasUnfilledRequiredFields, hasValidationErrors);

    this.props.dispatch(action);
  };

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(steppingBackRegistration);
  };

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
          onSubmit={this.handleFormSubmit}
        >
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">Main Venue</span>
            </label>
            <div className="boss-form__select">
              <SelectControl
                className=""
                model=".mainVenue"
                options={this.props.venueOptions}
                validators={{
                  isFilled: isNotEmptyInput,
                } as MainVenueValidators}
              />
            </div>

            <Errors
              model=".mainVenue"
              messages={{
                isFilled: isRequiredField
              }}
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
              component={DatePicker}
              className="react-datepicker__input-container"
              model=".startsAt"
              mapProps={{
                className: setInputClass,
                selected: (props) => props.viewValue,
                onChange: (props) => {
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
            <input type="submit" className="boss-button boss-button_role_submit boss-buttons-group_adjust_button" value="Continue"/>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    venueOptions: Component.getVenueOptions(state.app.venues)
  };
};

export default connect(
  mapStateToProps
)(Component);
