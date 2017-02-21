/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {Control, Form, Errors} from 'react-redux-form';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, WorkFormFields} from '../../../interfaces/store-models';
import {OfType} from '../../../interfaces/index';
import {setInputClass, renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import {isRequiredField} from '../../../constants/form-errors';
import {isNotEmpty as isFilled, isNationalInsuranceNumber, isPinCode} from '../../../helpers';
import workInfoBlockValidated from '../../../action-creators/work-info-block-validated';
import registrationStepBack from '../../../action-creators/registration-step-back';

interface Props {
}

interface MappedProps {
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

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(registrationStepBack);
  };

  render() {
    return (
      <div className="boss3-forms-block">
        <Form
          model="formsData.workForm"
          className="boss3-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label-text">Staff Type</span>
            <Control.text
              className="boss3-input"
              model=".staffType"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Sia Badge Number</span>
            <Control.text
              className="boss3-input"
              model=".siaBadgeNumber"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Sia Badge Expiry Date</span>
            <Control.text
              className="boss3-input"
              model=".siaBadgeExpiryDate"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">PIN Code</span>
            <Control.text
              className="boss3-input"
              model=".pinCode"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              validators={{
                isPinCode
              }}
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">National Insurance Number</span>
            <Control.text
              className="boss3-input"
              model=".nationalInsuranceNumber"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
              validators={{
                isNationalInsuranceNumber
              }}
            />
            <Errors
              model=".nationalInsuranceNumber"
              messages={{
                    isFilled: isRequiredField
                  }}
              show={{touched: true, focus: false}}
              wrapper={renderErrorsBlock}
              component={renderErrorComponent}
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Day Preference</span>
            <Control.text
              className="boss3-input"
              model=".dayPreference"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text">Hours Preference</span>
            <Control.text
              className="boss3-input"
              model=".hoursPreference"
              mapProps={{
                    className: setInputClass
                  }}
              validateOn="blur"
            />
          </label>

          <label className="boss3-label">
            <span className="boss3-label-text boss3-label-text_type_required">Pay Rate</span>
            <Control.text
              className="boss3-input"
              model=".payRate"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
              validators={{
                isFilled
              }}
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

          <label className="boss3-label">
            <span className="boss3-label-text">Starter Employment Status</span>
            <Control.text
              className="boss3-input"
              model=".starterEmploymentStatus"
              mapProps={{
                className: setInputClass
              }}
              validateOn="blur"
            />
          </label>

          <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
            <input type="button"
                   className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
                   value="Back"
                   onClick={this.onBackClick}
            />
            <input type="submit" className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button" value="Continue"/>
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
