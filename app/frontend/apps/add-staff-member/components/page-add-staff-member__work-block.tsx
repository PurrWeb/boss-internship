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
import {isNationalInsuranceNumber, isPinCode, isNotEmptyComboBox, isNotEmpty} from '../../../helpers';
import workInfoBlockValidated from '../../../action-creators/work-info-block-validated';
import registrationStepBack from '../../../action-creators/registration-step-back';
import SelectFixed from './react-select-fixed';
import {StaffType, Payrate} from '../../../interfaces/common-data-types';
import {
  StarterEmploymentStatusNumberFormValidators, PinCodeInputValidators,
  NationalInsuranceNumberInputValidators, PayRateInputValidators
} from '../../../interfaces/forms';

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

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = (formModelData: OfType<WorkFormFields, any>) => {
    const action = workInfoBlockValidated(formModelData);

    this.props.dispatch(action);
  };

  static getStaffTypeOptions(staffTypeIds: StaffType[]): Select.Option[] {
    return staffTypeIds.map((data) => ({value: data.id, label: data.name}));
  }

  static getPayrateOptions(payrateValues: Payrate[]): Select.Option[] {
    return payrateValues.map((data) => ({value: data.id, label: data.name}));
  }

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(registrationStepBack);
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
          validators={{
            starterEmploymentStatus: {
              isFilled: isNotEmpty
            }
          } as StarterEmploymentStatusNumberFormValidators}
        >
          <label className="boss3-label">
            <span className="boss3-label__text">Staff Type</span>
            <Control
              component={SelectFixed}
              className="boss3-input"
              model=".staffType"
              mapProps={{
                className: setInputClass,
                options: () => this.props.staffTypeOptions,
                value: (props) => props.modelValue,
                onChange: (props) => {
                  return props.onChange;
                }
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
            <Control
              component={SelectFixed}
              className="boss3-input"
              model=".payRate"
              mapProps={{
                className: setInputClass,
                options: () => this.props.payrateOptions,
                value: (props) => props.modelValue,
                onChange: (props) => {
                  return props.onChange;
                }
              }}
              validateOn="change"
              persist={true}
              validators={{
                isFilled: isNotEmptyComboBox,
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
            <h4 className="boss3-fields-set__header boss3-fields-set_adjust_header">
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
                    value="1"
                  />
                  <span className="boss3-label__text">I have supplied...</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="2"
                  />
                  <span className="boss3-label__text">I have supplied...</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="3"
                  />
                  <span className="boss3-label__text">I have supplied...</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="4"
                  />
                  <span className="boss3-label__text">I have supplied...</span>
                </label>
              </li>
              <li>
                <label className="boss3-label">
                  <Control.radio
                    className="boss3-input"
                    model=".starterEmploymentStatus"
                    value="5"
                  />
                  <span className="boss3-label__text">I have supplied...</span>
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
    staffTypeOptions: Component.getStaffTypeOptions(state.app.staffTypeIds),
    payrateOptions: Component.getPayrateOptions(state.app.payrateValues),
    isStaffTypeSecurity: (state.formsData.workForm.staffType as Select.Option).value === 11
  };
};

export default connect(
  mapStateToProps
)(Component);
