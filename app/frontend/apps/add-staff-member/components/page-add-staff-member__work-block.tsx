/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import * as Select from 'react-select';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, WorkFormFields} from '../../../interfaces/store-models';
import {OfType} from '../../../interfaces/index';
import {setInputClass, renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import {isRequiredField, formatInvalid} from '../../../constants/form-errors';
import {isNationalInsuranceNumber, isPinCode, isNotEmptyInput} from '../../../helpers';
import workInfoBlockValidated from '../../../action-creators/work-info-block-validated';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import {OptionData} from '../../../interfaces/common-data-types';
import {
  PinCodeInputValidators,
  NationalInsuranceNumberInputValidators, PayRateInputValidators, StarterEmploymentStatusInputValidators
} from '../../../interfaces/forms';
import SelectControl from './select-control';

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

const STAFF_TYPE_SECURITY_IDX = '11';

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = (formModelData: OfType<WorkFormFields, any>) => {
    const action = workInfoBlockValidated(formModelData);

    this.props.dispatch(action);
  };

  static getStaffTypeOptions(staffTypes: OptionData[]): Select.Option[] {
    return staffTypes.map((data) => ({value: data.id, label: data.name}));
  }

  static getPayrateOptions(payrates: OptionData[]): Select.Option[] {
    return payrates.map((data) => ({value: data.id, label: data.name}));
  }

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(steppingBackRegistration);
  };

  renderSiaBadgeNumberInputBlock() {
    return this.props.isStaffTypeSecurity ? (
      <label className="boss3-label">
        <span className="boss3-label__text">Sia Badge Number</span>
        <Control.text
          className="boss3-input"
          model=".siaBadgeNumber"
          mapProps={{
                  className: setInputClass
                }}
          validateOn="blur"
        />
      </label>
    ) : null;
  }

  renderSiaBadgeExpiryDateInputBlock() {
    return this.props.isStaffTypeSecurity ? (
      <label className="boss3-label">
        <span className="boss3-label__text">Sia Badge Expiry Date</span>
        <Control.text
          className="boss3-input"
          model=".siaBadgeExpiryDate"
          mapProps={{
                  className: setInputClass
                }}
          validateOn="blur"
        />
      </label>
    ) : null;
  }

  render() {
    return (
      <div className="boss3-forms-block">
        <Form
          model="formsData.workForm"
          className="boss3-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label__text">Staff Type</span>
            <SelectControl
              model=".staffType"
              className="boss3-input"
              options={this.props.staffTypeOptions}
              mapProps={{
                value: (props) => props.modelValue,
              }}
            />
          </label>

          {this.renderSiaBadgeNumberInputBlock()}

          {this.renderSiaBadgeExpiryDateInputBlock()}

          <label className="boss3-label">
            <span className="boss3-label__text">PIN Code</span>
            <Control.text
              className="boss3-input"
              model=".pinCode"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              persist={true}
              validators={{
                isPinCode
              } as PinCodeInputValidators}
            />
            <Errors
              model=".pinCode"
              messages={{
                    isPinCode: formatInvalid
                  }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label__text">National Insurance Number</span>
            <Control.text
              className="boss3-input"
              model=".nationalInsuranceNumber"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
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

          <label className="boss3-label">
            <span className="boss3-label__text">Day Preference</span>
            <Control.textarea
              className="boss3-input"
              model=".dayPreference"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
            <span className="boss3-label__tip boss3-label_adjust_tip">
              Preferred days to work displayed in the rota (e.g. mornings and weekends)
            </span>
          </label>

          <label className="boss3-label">
            <span className="boss3-label__text">Hours Preference</span>
            <Control.textarea
              className="boss3-input"
              model=".hoursPreference"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
            <span className="boss3-label__tip boss3-label_adjust_tip">
              Preferred number of hours to work per week displayed in the Rota (e.g. 40, 20+)
            </span>
          </label>

          <label className="boss3-label">
            <span className="boss3-label__text boss3-label__text_type_required">Pay Rate</span>
            <SelectControl
              model=".payRate"
              className="boss3-input"
              options={this.props.payrateOptions}
              mapProps={{
                value: (props) => props.modelValue,
              }}
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
          </label>

          <fieldset className="boss3-fields-set boss3-form_adjust_boss3-fields-set">
            <h4 className="boss3-fields-set__header boss3-fields-set__header_type_required boss3-fields-set_adjust_header">
              Starter Employment Status Statements
            </h4>

            <h5 className="boss3-fields-set__section-header boss3-fields-set_adjust_section-header">
              Tick one that applies
            </h5>

            <ul className="boss3-inputs-list boss3-fields-set_adjust_boss3-inputs-list">
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="staff_member[employment_status_p45_supplied]"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss3-label__text">I have supplied my P45 from my previous employer</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="staff_member[employment_status_a]"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss3-label__text">This is my first job since the 6th of April. I have not been receiving taxable Jobseeker's Allowance, Incapacity Benefit or a state/occupational pernsion.</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="staff_member[employment_status_b]"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss3-label__text">This is now my only job. Since the 6th of April I have had another job, received taxable Jobseeker's Allowance or Incapacity Benefit. I do not receive a state/occupational pension.</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="staff_member[employment_status_c]"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss3-label__text">I have another job or receive a state/occupational pernsion.</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="staff_member[employment_status_d]"
                    validateOn="change"
                    persist={true}
                    validators={{
                      isFilled: isNotEmptyInput,
                    } as StarterEmploymentStatusInputValidators}
                  />
                  <span className="boss3-label__text">I left a course of higher education before the 6th of April & received my first student loan instalment on or after the 1st of September 1998 & I have not fully repaid my student loan.</span>
                </label>
              </li>
            </ul>

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
          </fieldset>



          <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
            <input type="button"
                   className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
                   value="Back"
                   onClick={this.onBackClick}
            />
            <input type="submit" className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button"
                   value="Continue"/>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    staffTypeOptions: Component.getStaffTypeOptions(state.app.staffTypes),
    payrateOptions: Component.getPayrateOptions(state.app.payrates),
    isStaffTypeSecurity: state.formsData.workForm.staffType === STAFF_TYPE_SECURITY_IDX
  };
};

export default connect(
  mapStateToProps
)(Component);
