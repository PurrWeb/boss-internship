import * as React from 'react';
import {connect} from 'react-redux';
import {pipe, values, omit, find, not} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import currentStepChanged from '../../../action-creators/current-step-changed';
import {AppForms, FormStructure} from '../../../reducers/forms';
import {AddStaffMemberSteps} from '../../../constants/other';
import {FieldState} from 'react-redux-form';

interface Props {
}

interface MappedProps {
  readonly forms: AppForms;
  readonly completedSteps: number;
  readonly currentStep: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

interface StepData {
  readonly title: string;
}

const stepsData: StepData[] = [
  {
    title: 'Basic Information'
  },
  {
    title: 'Upload Photo'
  },
  {
    title: 'Venue'
  },
  {
    title: 'Address'
  },
  {
    title: 'Work'
  },
  {
    title: 'Preview'
  }
];

class Component extends React.Component<PropsFromConnect, State> {
  onStepClick = (step: number) => {
    const action = currentStepChanged(step);

    this.props.dispatch(action);
  };

  static getFormError(formData: FormStructure<any>): boolean {
    return pipe< FormStructure<any>, {}, FieldState[], FieldState, boolean>(
      omit(['$form']),
      values,
      find((fieldData: FieldState) => fieldData.touched && !fieldData.valid),
      not
    )(formData);
  }

  static getStepsValidity(forms: AppForms) {
    return {
      [AddStaffMemberSteps.BasicInformationBlock]: Component.getFormError(forms.basicInformationForm),
      [AddStaffMemberSteps.AddAvatarBlock]: Component.getFormError(forms.uploadPhotoForm),
      [AddStaffMemberSteps.VenuesBlock]: Component.getFormError(forms.venueForm),
      [AddStaffMemberSteps.ContactDetailsBlock]: Component.getFormError(forms.contactDetailsForm),
      [AddStaffMemberSteps.WorkBlock]: Component.getFormError(forms.workForm),
      [AddStaffMemberSteps.PreviewBlock]: true
    };
  }

  drawSteps(completedSteps: number, currentStep: number) {
    const stepsValidity = Component.getStepsValidity(this.props.forms);

    return stepsData.map((stepData, idx) => {
      const completeClassName = completedSteps === idx ? 'boss3-steps-block__step_state_complete' : '';
      const stepWithErrorClassName = stepsValidity[idx] ? '' : 'boss3-steps-block__step_state_with-error';
      const currentStepClassName = currentStep === idx ? 'boss3-steps-block__step-title_state_active' : '';

      return (
        <li key={idx} className={`boss3-steps-block__step ${completeClassName} ${stepWithErrorClassName}`}>
          <div
              className="boss3-steps-block__step-index"
              onClick={() => {
                this.onStepClick(idx);
              }}
          >
            {idx + 1}
          </div>
          <div className={`boss3-steps-block__step-title ${currentStepClassName}`}>{stepData.title}</div>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="boss3-steps-block">
        {this.drawSteps(this.props.completedSteps, this.props.currentStep)}
      </ul>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    forms: state.formsData.forms,
    completedSteps: state.app.completedSteps,
    currentStep: state.app.currentStep
  };
};

export default connect(
  mapStateToProps
)(Component);
