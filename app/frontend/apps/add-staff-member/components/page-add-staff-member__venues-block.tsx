/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form} from 'react-redux-form';
import * as DatePicker from 'react-datepicker';
import * as Select from 'react-select';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, VenueFormFields} from '../../../interfaces/store-models';
import {setInputClass} from '../../../helpers/renderers';
import {OptionData} from '../../../interfaces/common-data-types';
import venuesInfoBlockValidated from '../../../action-creators/venues-info-block-validated';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import {OfType} from '../../../interfaces/index';
import SelectControl from './select-control';

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
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss-label">
            <span className="boss-label__text">Main Venue</span>
            <SelectControl
              model=".mainVenue"
              className="boss-input"
              options={this.props.venueOptions}
            />
          </label>

          <label className="boss-label">
            <span className="boss-label__text">Other Venues</span>
            <SelectControl
              model=".otherVenues"
              value={[]}
              className="boss-input"
              multi={true}
              options={this.props.venueOptions}
            />
          </label>

          <label className="boss-label boss-label_role_datepicker">
            <span className="boss-label__text">Starts At</span>
            <Control
              component={DatePicker}
              className="boss-input"
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
