/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import * as DatePicker from 'react-datepicker';
import * as Select from 'react-select';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, BasicInformationFormFields} from '../../../interfaces/store-models';
import {OfType} from '../../../interfaces/index';
import {isNotEmptyComboBox} from '../../../helpers';
import {isRequiredField} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent, setInputClass} from '../../../helpers/renderers';
import basicInformationBlockValidated from '../../../action-creators/basic-information-block-validated';
import SelectFixed from './react-select-fixed';

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
      <div className="boss3-forms-block">
        <Form
          model="formsData.basicInformationForm"
          className="boss3-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label-text">First Name</span>
            <Control.text
              className="boss3-input"
              model=".firstName"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Surname</span>
            <Control.text
              className="boss3-input"
              model=".surname"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text boss3-label-text_type_required">Gender</span>
            <Control
              component={SelectFixed}
              className="boss3-input"
              model=".gender"
              mapProps={{
                className: setInputClass,
                options: () => this.props.genderOptions,
                value: (props) => props.modelValue,
                onChange: (props) => {
                  return props.onChange;
                }
              }}
              validateOn="change"
              persist={true}
              validators={{
                isFilled: isNotEmptyComboBox,
              }}
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

          <label className="boss3-label boss3-label_role_datepicker">
            <span className="boss3-label-text">Date of Birth</span>
            <Control
              component={DatePicker}
              className="boss3-input"
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

          <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
            <input type="submit" className="boss3-button boss3-buttons-group_adjust_button" value="Continue"/>
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
