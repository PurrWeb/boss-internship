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
import {EmailInputValidators, PhoneNumberInputValidators} from '../../../interfaces/forms';

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

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(steppingBackRegistration);
  };

  render() {
    return (
      <div className="boss-forms-block">
        <Form
          model="formsData.contactDetailsForm"
          className="boss-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss-label">
            <span className="boss-label__text boss-label__text_type_required">Email</span>
            <Control.text
              className="boss-input"
              model=".email"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              persist={true}
              validators={{
                isFilled,
                isEmail
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

          <label className="boss-label">
            <span className="boss-label__text">Address</span>
            <Control.text
              className="boss-input"
              model=".address"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
            />
          </label>

          <label className="boss-label">
            <span className="boss-label__text">Country</span>
            <Control.textarea
              className="boss-input"
              model=".country"
              mapProps={{
                className: setInputClass,
              }}
            />
          </label>

          <label className="boss-label">
            <span className="boss-label__text">Post Code</span>
            <Control.text
              className="boss-input"
              model=".postCode"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
            />
          </label>

          <label className="boss-label">
            <span className="boss-label__text">Phone Number</span>
            <Control.text
              className="boss-input"
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
  return {};
};

export default connect(
  mapStateToProps
)(Component);
