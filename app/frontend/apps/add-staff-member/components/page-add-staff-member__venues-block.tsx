/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form} from 'react-redux-form';
import * as DatePicker from 'react-datepicker';
import * as Select from 'react-select';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, VenueFormFields} from '../../../interfaces/store-models';
import {setInputClass} from '../../../helpers/renderers';
import {Venue} from '../../../interfaces/common-data-types';
import venuesInfoBlockValidated from '../../../action-creators/venues-info-block-validated';
import registrationStepBack from '../../../action-creators/registration-step-back';
import {OfType} from '../../../interfaces/index';
import SelectFixed from './react-select-fixed';

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

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(registrationStepBack);
  };

  static getVenueOptions(venueValues: Venue[]) {
    return venueValues.map((venueValue) => ({value: venueValue.id, label: venueValue.name}));
  }

  render() {
    return (
      <div className="boss3-forms-block">
        <Form
          model="formsData.venueForm"
          className="boss3-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label-text">Main Venue</span>
            <Control
              component={SelectFixed}
              className="boss3-input"
              model=".mainVenue"
              mapProps={{
                className: setInputClass,
                options: () => this.props.venueOptions,
                value: (props) => props.modelValue,
                onChange: (props) => {
                  return props.onChange;
                }
              }}
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Other Venues</span>
            <Control
              component={SelectFixed}
              className="boss3-input"
              model=".otherVenues"
              mapProps={{
                className: setInputClass,
                options: () => this.props.venueOptions,
                value: (props) => props.modelValue,
                onChange: (props) => {
                  return props.onChange;
                }
              }}
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Starts At</span>
            <Control.text
              className="boss3-input"
              model=".startsAt"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label boss3-label_role_datepicker">
            <span className="boss3-label-text">Starts At</span>
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
    venueOptions: Component.getVenueOptions(state.app.venueValues)
  };
};

export default connect(
  mapStateToProps
)(Component);
