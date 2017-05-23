/// <reference path="../../../custom-typings/react-redux-form.d.ts" />
/// <reference path="../../../../../node_modules/@types/validator/index.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';
import * as isEmail from 'validator/lib/isEmail';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, ContactDetailsFormFields} from '../../../interfaces/store-models';
import {OfType} from '../../../interfaces/index';
import {isNotEmptyInput as isFilled, isMobilePhoneSimpleCheck} from '../../../helpers';
import {isRequiredField, isWrongEmail, isPhoneNumber} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent, setInputClass} from '../../../helpers/renderers';
import contactDetailsBlockValidated from '../../../action-creators/contact-details-block-validated';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import {EmailInputValidators, PhoneNumberInputValidators, IsFilledInputValidator} from '../../../interfaces/forms';
import {ContactDetailsForm} from '../../../reducers/forms';
import {hasFormUnfilledRequiredFields, hasFormValidationErrors} from '../../../helpers/validators';
import changingStepInfo from '../../../action-creators/changing-step-info';
import findFlaggedStaffMembers from '../../../action-creators/requesting-flagged-staff-members';

interface Props {
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  handleFormSubmit = (formModelData: OfType<ContactDetailsFormFields, any>) => {
    const action = contactDetailsBlockValidated(formModelData);

    this.props.dispatch(action);
  };

  handleFormUpdate = (formModelData: ContactDetailsForm) => {
    const visited = true;
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<ContactDetailsForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<ContactDetailsForm>(formModelData);
    const action = changingStepInfo('ContactDetailsBlock', visited, hasUnfilledRequiredFields, hasValidationErrors);

    this.props.dispatch(action);
  };

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(steppingBackRegistration);
  };

  findFlaggedStaffMembers = (model: any, value: any) => {
    this.props.dispatch(findFlaggedStaffMembers({model, value}));
  }
  
  static isEmail(val: string) {
    return val ? isEmail(val) : true;
  }

  render() {
    return (
      <Form
        model="formsData.contactDetailsForm"
        className="boss-form"
        onUpdate={this.handleFormUpdate}
        onSubmit={this.handleFormSubmit}
      >
        <div className="boss-form__field">
          <label className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_required">Email</span>
            <Control.text
              className="boss-form__input"
              model=".email"
              mapProps={{
                className: setInputClass
              }}
              changeAction={this.findFlaggedStaffMembers}
              debounce={500}
              asyncValidateOn="blur"
              persist={true}
              validators={{
                isFilled,
                isEmail: Component.isEmail
              } as EmailInputValidators}
            />
            <Errors
              model=".email"
              messages={{
                isFilled: isRequiredField,
                isEmail: isWrongEmail
              }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </label>
        </div>

        <div className="boss-form__field">
          <label className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_required">Address</span>
            <Control.text
              className="boss-form__input"
              model=".address"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              validators={{
                isFilled,
              } as IsFilledInputValidator}

            />
            <Errors
              model=".address"
              messages={{
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
            <span className="boss-form__label-text boss-form__label-text_type_required">Country</span>
            <Control.text
              className="boss-form__input"
              model=".country"
              mapProps={{
                className: setInputClass,
              }}
              validateOn="blur"
              persist={true}
              validators={{
                isFilled,
              } as IsFilledInputValidator}

            />
            <Errors
              model=".country"
              messages={{
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
            <span className="boss-form__label-text">County</span>
            <Control.text
              className="boss-form__input"
              model=".county"
              mapProps={{
                className: setInputClass,
              }}
            />
          </label>
        </div>
        <div className="boss-form__field">
          <label className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_required">Post Code</span>
            <Control.text
              className="boss-form__input"
              model=".postCode"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              validators={{
                isFilled,
              } as IsFilledInputValidator}
            />
            <Errors
              model=".postCode"
              messages={{
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
            <span className="boss-form__label-text">Phone Number</span>

            <Control.text
              className="boss-form__input"
              model=".phoneNumber"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              persist={true}
              validators={{
                isPhoneNumber: isMobilePhoneSimpleCheck
              } as PhoneNumberInputValidators}
            />
            <Errors
              model=".phoneNumber"
              messages={{
                isPhoneNumber: isPhoneNumber
              }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </label>
        </div>

        <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
          <input type="button"
                  className="boss-button boss-button_role_back boss-buttons-group_adjust_button"
                  value="Back"
                  onClick={this.onBackClick}
          />
          <input type="submit" className="boss-button boss-button_role_submit boss-buttons-group_adjust_button" value="Continue"/>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {};
};

export default connect(
  mapStateToProps
)(Component);
