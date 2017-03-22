/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import * as DatePicker from 'react-datepicker';
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
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<VenueForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<VenueForm>(formModelData);
    const action = changingStepInfo('VenuesBlock', hasUnfilledRequiredFields, hasValidationErrors);

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
      <div className="boss3-forms-block">
        <Form
          model="formsData.venueForm"
          className="boss3-form"
          onUpdate={this.handleFormUpdate}
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label__text boss3-label__text_type_required">Main Venue</span>
            <SelectControl
              model=".mainVenue"
              className="boss3-input"
              options={this.props.venueOptions}
              validators={{
                isFilled: isNotEmptyInput,
              } as MainVenueValidators}
            />
            <Errors
              model=".mainVenue"
              messages={{
                isFilled: isRequiredField
              }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label__text">Other Venues</span>
            <SelectControl
              model=".otherVenues"
              value={[]}
              className="boss3-input"
              multi={true}
              options={this.props.venueOptions}
            />
          </label>

          <label className="boss3-label boss3-label_role_datepicker">
            <span className="boss3-label__text">Starts At</span>
            <Control
              component={DatePicker}
              className="boss3-input"
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
          </label>

          <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
            <input type="button"
                   className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
                   value="Back"
                   onClick={this.onBackClick}
            />
            <input type="submit" className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button" value="Continue"/>
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
