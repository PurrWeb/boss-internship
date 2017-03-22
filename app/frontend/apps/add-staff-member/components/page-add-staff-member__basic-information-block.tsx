/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors, FieldState, ValidityObject} from 'react-redux-form';
import * as DatePicker from 'react-datepicker';
import * as Select from 'react-select';
import {pipe, omit, values, find} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, BasicInformationFormFields} from '../../../interfaces/store-models';
import {OfType, Dict} from '../../../interfaces/index';
import {isNotEmptyInput} from '../../../helpers';
import {isRequiredField} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent, setInputClass} from '../../../helpers/renderers';
import basicInformationBlockValidated from '../../../action-creators/basic-information-block-validated';
import {GenderInputValidators} from '../../../interfaces/forms';
import SelectControl from './select-control';
import changingStepInfo from '../../../action-creators/changing-step-info';
import {BasicInformationForm} from '../../../reducers/forms';

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

  handleFormUpdate = (formModelData: BasicInformationForm) => {
    const hasUnfilledRequiredFields = Component.hasUnfilledRequiredFields(formModelData);
    const hasValidationErrors = Component.hasValidationErrors(formModelData);
    const action = changingStepInfo('BasicInformationBlock', hasUnfilledRequiredFields, hasValidationErrors);

    this.props.dispatch(action);
  };

  static hasValidationErrors(formModelData: BasicInformationForm) {
    return pipe<BasicInformationForm, Dict<FieldState>, FieldState[], FieldState | undefined, boolean>(
      omit(['$form']),
      values,
      find((fieldData: FieldState) => fieldData.validity ?
          pipe<ValidityObject, ValidityObject, boolean[], boolean>(
            omit(['isFilled']),
            values,
            find((isValid: boolean) => isValid === false),
          )(fieldData.validity as ValidityObject) :
          false
      ),
      Boolean
    )(formModelData);
  }


  static hasUnfilledRequiredFields(formModelData: BasicInformationForm) {
    return pipe<BasicInformationForm, Dict<FieldState>, FieldState[], FieldState | undefined, boolean>(
      omit(['$form']),
      values,
      find((fieldData: FieldState) => fieldData.validity && fieldData.validity.isFilled === false),
      Boolean
    )(formModelData);
  }

  static getGenderOptions(genderValues: string[]) {
    return genderValues.map((venueValue) => ({value: venueValue, label: venueValue}));
  }

  render() {
    return (
      <div className="boss3-forms-block">
        <Form
          model="formsData.basicInformationForm"
          className="boss3-form"
          onUpdate={this.handleFormUpdate}
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label__text">First Name</span>
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
            <span className="boss3-label__text">Surname</span>
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
            <span className="boss3-label__text boss3-label__text_type_required">Gender</span>
            <SelectControl
              model=".gender"

              className="boss3-input"
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

          <label className="boss3-label boss3-label_role_datepicker">
            <span className="boss3-label__text">Date of Birth</span>
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
