/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import * as Select from 'react-select';
import BossDatePicker from '../../../components/react-dates/boss-date-picker';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, WorkFormFields} from '../../../interfaces/store-models';
import {OfType} from '../../../interfaces/index';
import {setInputClass, renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import {isRequiredField, formatInvalid} from '../../../constants/form-errors';
import {isNationalInsuranceNumber, isPinCode, isNotEmptyInput, isNotEmptyInput as isFilled} from '../../../helpers';

import {OptionData} from '../../../interfaces/common-data-types';
import {
  PinCodeInputValidators,
  NationalInsuranceNumberInputValidators, PayRateInputValidators, StarterEmploymentStatusInputValidators
} from '../../../interfaces/forms';
import SelectControl from './select-control';
import {starterEmploymentStatusLabels} from '../../../constants/other';
import {WorkForm} from '../../../reducers/forms';
import {hasFormUnfilledRequiredFields, hasFormValidationErrors} from '../../../helpers/validators';
import changingStepInfo from '../../../action-creators/changing-step-info';
import findFlaggedStaffMembers from '../../../action-creators/requesting-flagged-staff-members';

import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import changeStep from '../../../action-creators/current-step-changed';

interface Props {
}

interface MappedProps {
  readonly staffTypeOptions: Select.Option[];
  readonly payrateOptions: Select.Option[];
  readonly isStaffTypeSecurity: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

const STAFF_TYPE_SECURITY_IDX = 11;

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = () => {
    this.props.dispatch(changeStep('formsData.workForm', ADD_STAFF_MEMBER_STEPS.WorkBlock + 1));
  };

  handleFormUpdate = (formModelData: WorkForm) => {
    const visited = true;
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<WorkForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<WorkForm>(formModelData);
    const action = changingStepInfo('WorkBlock', visited, hasUnfilledRequiredFields, hasValidationErrors);

    this.props.dispatch(action);
  };

  findFlaggedStaffMembers = (model: string, value: string) => {
    return (dispatch: any) => { dispatch(findFlaggedStaffMembers({model, value})); };
  }

  static getStaffTypeOptions(staffTypes: OptionData[]): Select.Option[] {
    return staffTypes.map((data) => ({value: data.id, label: data.name}));
  }

  static getPayrateOptions(payRates: OptionData[]): Select.Option[] {
    return payRates.map((data) => ({value: data.id, label: data.name}));
  }

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(changeStep('formsData.workForm', ADD_STAFF_MEMBER_STEPS.WorkBlock - 1));
  };

  renderSiaBadgeNumberInputBlock() {
    return this.props.isStaffTypeSecurity ? (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">Sia Badge Number</span>
          <Control.text
            className="boss-form__input"
            model=".siaBadgeNumber"
            mapProps={{
                    className: setInputClass
                  }}
            validateOn="blur"
          />
        </label>
      </div>
    ) : null;
  }

  renderSiaBadgeExpiryDateInputBlock() {
    return this.props.isStaffTypeSecurity ? (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">Sia Badge Expiry Date</span>
        </label>
        <Control.text
          component={BossDatePicker}
          model=".siaBadgeExpiryDate"
          mapProps={{
            date: (props) => props.viewValue,
            onApply: (props) => {
              return props.onChange;
            }
          }}
          validateOn="blur"
        />
      </div>
    ) : null;
  }

  render() {
    return (
        <Form
          model="formsData.workForm"
          className="boss-form"
          onUpdate={this.handleFormUpdate}
        >
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text">Staff Type</span>
            </label>
            <div className="boss-form__select">
              <SelectControl
                model=".staffType"
                className=""
                options={this.props.staffTypeOptions}
              />
            </div>
          </div>

          {this.renderSiaBadgeNumberInputBlock()}

          {this.renderSiaBadgeExpiryDateInputBlock()}

          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text boss-form__label-text_type_required">PIN Code</span>
              <Control.text
                className="boss-form__input"
                model=".pinCode"
                mapProps={{
                  className: setInputClass
                }}
                validateOn="blur"
                persist={true}
                validators={{
                  isFilled,
                  isPinCode
                } as PinCodeInputValidators}
              />
              <Errors
                model=".pinCode"
                messages={{
                      isPinCode: formatInvalid,
                      isFilled: isRequiredField
                    }}
                show={{touched: true, focus: false}}
                wrapper={renderErrorsBlock}
                component={renderErrorComponent}
              />
            </label>
          </div>

          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text">National Insurance Number</span>
              <Control.text
                className="boss-form__input"
                model=".nationalInsuranceNumber"
                mapProps={{
                      className: setInputClass
                    }}
                changeAction={this.findFlaggedStaffMembers}
                debounce={500}
                asyncValidateOn="blur"
                persist={true}
                validators={{
                  isNationalInsuranceNumber
                } as NationalInsuranceNumberInputValidators}
              />
              <Errors
                model=".nationalInsuranceNumber"
                messages={{
                      isNationalInsuranceNumber: formatInvalid
                    }}
                show={{touched: true, focus: false}}
                wrapper={renderErrorsBlock}
                component={renderErrorComponent}
              />
            </label>
          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text">Day Preference</span>
              <Control.textarea
                className="boss-form__input"
                model=".dayPreference"
                mapProps={{
                      className: setInputClass
                    }}
                validateOn="blur"
              />
              <span className="boss-label__tip boss-label_adjust_tip">
                Preferred days to work displayed in the rota (e.g. mornings and weekends)
              </span>
            </label>
          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text">Hours Preference</span>
              <Control.textarea
                className="boss-form__input"
                model=".hoursPreference"
                mapProps={{
                      className: setInputClass
                    }}
                validateOn="blur"
              />
              <span className="boss-label__tip boss-label_adjust_tip">
                Preferred number of hours to work per week displayed in the Rota (e.g. 40, 20+)
              </span>
            </label>
          </div>
          <div className="boss-form__field">
            <label className="boss-form__label">
              <span className="boss-form__label-text">Pay Rate</span>
              <div className="boss-form__select">
                <SelectControl
                  model=".payRate"
                  className=""
                  options={this.props.payrateOptions}
                  validateOn="change"
                  validators={{
                    isFilled: isNotEmptyInput,
                  } as PayRateInputValidators}
                />
                <Errors
                  model=".payRate"
                  messages={{
                        isFilled: isRequiredField
                      }}
                  show={{touched: true, focus: false}}
                  wrapper={renderErrorsBlock}
                  component={renderErrorComponent}
                />
              </div>
            </label>
          </div>
          
            <div className="boss-form__field">
              <Errors
                model=".starterEmploymentStatus"
                messages={{
                      isFilled: isRequiredField
                    }}
                show={(field) =>
                  field.submitFailed || field.touched
                }
                wrapper={renderErrorsBlock}
                component={renderErrorComponent}
              />
          <div className="boss-choice-list boss-choice-list_type_required">
            <div className="boss-choice-list__header">
              <h3 className="boss-choice-list__title">
                Starter Employment Status Statements
              </h3>
            </div>
            <div className="boss-choice-list__content">

              <p className="boss-choice-list__text">
                Tick one that applies
              </p>
              <div className="boss-choice-list__controls">
                <label className="boss-choice-list__radio-label">
                  <Control.radio
                    className="boss-choice-list__radio-button"
                    model=".starterEmploymentStatus"
                    value="employment_status_p45_supplied"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss-choice-list__radio-label-text">
                    {starterEmploymentStatusLabels['employment_status_p45_supplied']}
                  </span>
                </label>
                <label className="boss-choice-list__radio-label">
                  <Control.radio
                    className="boss-choice-list__radio-button"
                    model=".starterEmploymentStatus"
                    value="employment_status_a"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss-choice-list__radio-label-text">
                    {starterEmploymentStatusLabels['employment_status_a']}
                  </span>
                </label>
                <label className="boss-choice-list__radio-label">
                  <Control.radio
                    className="boss-choice-list__radio-button"
                    model=".starterEmploymentStatus"
                    value="employment_status_b"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss-choice-list__radio-label-text">
                    {starterEmploymentStatusLabels['employment_status_b']}
                  </span>
                </label>

                <label className="boss-choice-list__radio-label">
                  <Control.radio
                    className="boss-choice-list__radio-button"
                    model=".starterEmploymentStatus"
                    value="employment_status_c"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss-choice-list__radio-label-text">
                    {starterEmploymentStatusLabels['employment_status_c']}
                  </span>
                </label>
                <label className="boss-choice-list__radio-label">
                  <Control.radio
                    className="boss-choice-list__radio-button"
                    model=".starterEmploymentStatus"
                    value="employment_status_d"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss-choice-list__radio-label-text">
                    {starterEmploymentStatusLabels['employment_status_d']}
                  </span>
                </label>
              </div>
            </div>
          </div>

            </div>



          <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
            <input type="button"
                   className="boss-button boss-button_role_back boss-buttons-group_adjust_button"
                   value="Back"
                   onClick={this.onBackClick}
            />
            <input type="button" onClick={this.handleFormSubmit} className="boss-button boss-button_role_submit boss-buttons-group_adjust_button"
                   value="Continue"/>
          </div>
        </Form>

    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    staffTypeOptions: Component.getStaffTypeOptions(state.app.staffTypes),
    payrateOptions: Component.getPayrateOptions(state.app.payRates),
    isStaffTypeSecurity: state.formsData.workForm.staffType === STAFF_TYPE_SECURITY_IDX
  };
};

export default connect(
  mapStateToProps
)(Component);
