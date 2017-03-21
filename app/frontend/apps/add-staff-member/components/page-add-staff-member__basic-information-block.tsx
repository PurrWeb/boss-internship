/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors, ModelAction} from 'react-redux-form';
import * as DatePicker from 'react-datepicker';
import * as Select from 'react-select';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, BasicInformationFormFields} from '../../../interfaces/store-models';
import {OfType} from '../../../interfaces/index';
import {isNotEmptyInput} from '../../../helpers';
import {isRequiredField} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent, setInputClass} from '../../../helpers/renderers';
import basicInformationBlockValidated from '../../../action-creators/basic-information-block-validated';
import {GenderInputValidators} from '../../../interfaces/forms';
import SelectControl from './select-control';

interface Props {
}

interface MappedProps {
  readonly genderOptions: Select.Option[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
}

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = (formModelData: OfType<BasicInformationFormFields, any>) => {
    const action = basicInformationBlockValidated(formModelData);

    this.props.dispatch(action);
  };

  static getGenderOptions(genderValues: string[]) {
    return genderValues.map((venueValue) => ({value: venueValue, label: venueValue}));
  }

  render() {
    return (
      <div className="boss-forms-block">
        <Form
          model="formsData.basicInformationForm"
          className="boss-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss-label">
            <span className="boss-label__text">First Name</span>
            <Control.text
              className="boss-input"
              model=".firstName"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss-label">
            <span className="boss-label__text">Surname</span>
            <Control.text
              className="boss-input"
              model=".surname"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss-label">
            <span className="boss-label__text boss-label__text_type_required">Gender</span>
            <SelectControl
              model=".gender"

              className="boss-input"
              options={this.props.genderOptions}
              validateOn="change"
              validators={{
                isFilled: isNotEmptyInput,
              } as GenderInputValidators}
            />
            <Errors
              model=".gender"
              messages={{
                isFilled: isRequiredField
              }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </label>

          <label className="boss-label boss-label_role_datepicker">
            <span className="boss-label__text">Date of Birth</span>
            <Control
              component={DatePicker}
              className="boss-input"
              model=".dateOfBirth"
              mapProps={{
                className: setInputClass,
                selected: (props) => props.viewValue,
                showMonthDropdown: () => true,
                showYearDropdown: () => true,
                dropdownMode: () => 'select',
                onChange: (props) => {
                  return props.onChange;
                }
              }}
              validateOn="blur"
            />
          </label>

          <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
            <input type="submit" className="boss-button boss-buttons-group_adjust_button" value="Continue"/>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    genderOptions: Component.getGenderOptions(state.app.genderValues)
  };
};

export default connect(
  mapStateToProps
)(Component);
