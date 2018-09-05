/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors, FieldState, ErrorsObject} from 'react-redux-form';
import BossDatePicker from '../../../components/react-dates/boss-date-picker';
import * as Select from 'react-select';

// tslint:disable-next-line:no-require-imports

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, BasicInformationFormFields} from '../../../interfaces/store-models';
import {OfType, Dict} from '../../../interfaces/index';
import {isNotEmptyInput, isNotEmptyInput as isFilled} from '../../../helpers';
import {isRequiredField} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent, setInputClass} from '../../../helpers/renderers';
import {GenderInputValidators, IsFilledInputValidator} from '../../../interfaces/forms';
import SelectControl from './select-control';
import changingStepInfo from '../../../action-creators/changing-step-info';
import findFlaggedStaffMembers from '../../../action-creators/requesting-flagged-staff-members';
import {BasicInformationForm} from '../../../reducers/forms';
import {hasFormValidationErrors, hasFormUnfilledRequiredFields} from '../../../helpers/validators';
import {AddStaffMemberStepInfo, AddStaffMemberStepName} from '../../../interfaces/store-models';
import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import changeStep from '../../../action-creators/current-step-changed';

interface Props {
  readonly findFlaggedStaffMembers: any;
  readonly changeStep: any;
  readonly changingStepInfo: any;
}

interface MappedProps {
  readonly genderOptions: Select.Option[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
}

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = () => {
    this.props.changeStep('formsData.basicInformationForm', ADD_STAFF_MEMBER_STEPS.BasicInformationBlock + 1);
  };

  handleFormUpdate = (formModelData: BasicInformationForm) => {
    const visited = true;
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<BasicInformationForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<BasicInformationForm>(formModelData);

    // this.setState({isValid: hasUnfilledRequiredFields || hasValidationErrors});

    this.props.changingStepInfo('BasicInformationBlock', visited, hasUnfilledRequiredFields, hasValidationErrors);
  };

  static getGenderOptions(genderValues: string[]) {
    return genderValues.map((venueValue) => ({value: venueValue, label: venueValue}));
  }

  findFlaggedStaffMembers = (model: string, value: string) => {
    return (dispatch: any) => { this.props.findFlaggedStaffMembers(model, value); };
  }
  
  render() {
    return (
      <div className="boss-form">
        <Form
          model="formsData.basicInformationForm"
          className="boss-form"
          onUpdate={this.handleFormUpdate}
        >
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">First Name</span>
              <Control.text
                className="boss-form__input"
                model=".firstName"
                mapProps={{
                      className: setInputClass
                    }}
                changeAction={this.findFlaggedStaffMembers}
                debounce={500}
                validators={{
                  isFilled,
                } as IsFilledInputValidator}              
              />
              <Errors
                model=".firstName"
                messages={{
                  isFilled: isRequiredField
                }}
                show={ field => field.submitFailed }
                wrapper={renderErrorsBlock}
                component={renderErrorComponent}
              />
            </label>

          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">Surname</span>
              <Control.text
                className="boss-form__input"
                model=".surname"
                mapProps={{
                      className: setInputClass
                    }}
                changeAction={this.findFlaggedStaffMembers}
                debounce={500}
                validators={{
                  isFilled,
                } as IsFilledInputValidator}              
              />
              <Errors
                model=".surname"
                messages={{
                  isFilled: isRequiredField
                }}
                show={ field => field.submitFailed }
                wrapper={renderErrorsBlock}
                component={renderErrorComponent}
              />
            </label>
          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">Gender</span>
              <div className="boss-form__select">
                <SelectControl
                  model=".gender"
                  className="myclass"
                  searchable={false}
                  options={this.props.genderOptions}
                  validators={{
                    isFilled: isNotEmptyInput,
                  } as GenderInputValidators}
                />
              </div>
              <Errors
                model=".gender"
                messages={{
                  isFilled: isRequiredField
                }}
                show={ field => field.submitFailed }
                wrapper={renderErrorsBlock}
                component={renderErrorComponent}
              />
            </label>
          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text">Date of Birth</span>
            </label>
            <Control
                component={BossDatePicker}
                model=".dateOfBirth"
                mapProps={{
                  date: (props) => props.viewValue,
                  onApply: (props) => {
                    return props.onChange;
                  }
                }}
                changeAction={this.findFlaggedStaffMembers}
              />
          </div>
          <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
            <input
              type="button"
              onClick={this.handleFormSubmit}
              className={`boss-button boss-buttons-group_adjust_button`}
              value="Continue"/>
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

const mapDispatchToProps = (dispatch: any) => (
  {
    findFlaggedStaffMembers: (model: any, value: any) => dispatch(findFlaggedStaffMembers({model, value})),
    changeStep: (formModelData: string, step: number) => dispatch(changeStep(formModelData, step)),
    changingStepInfo: (stepName: AddStaffMemberStepName, visited: boolean, hasUnfilledRequired: boolean, hasValidationErrors: boolean) => dispatch(changingStepInfo(stepName, visited, hasUnfilledRequired, hasValidationErrors))
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
