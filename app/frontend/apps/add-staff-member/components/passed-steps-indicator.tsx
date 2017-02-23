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

const FormsWithRequiredFields = {
  [AddStaffMemberSteps.BasicInformationBlock]: true,
  [AddStaffMemberSteps.ContactDetailsBlock]: true,
  [AddStaffMemberSteps.WorkBlock]: true
};

class Component extends React.Component<PropsFromConnect, State> {
  onStepClick = (step: number) => {
    const action = currentStepChanged(step);

    this.props.dispatch(action);
  };

  static isFormWithoutErrors(formData: FormStructure<any>, formStepIdx: number, currentStep: number): boolean {
    const isFormInvalid = pipe< FormStructure<any>, {}, FieldState[], FieldState, boolean>(
      omit(['$form']),
      values,
      find((fieldData: FieldState) => fieldData.touched && !fieldData.valid),
      Boolean
    )(formData);

    const isCurrentStepForm = formStepIdx === currentStep;

    if (isCurrentStepForm) {
      return !isFormInvalid;
    } else {
      const isPrevRequiredForm = formStepIdx < currentStep && FormsWithRequiredFields[formStepIdx];

      if (isPrevRequiredForm) {
        return formData.$form.touched && !isFormInvalid;
      } else {
        return true;
      }
    }
  }

  static getStepsValidity(forms: AppForms, currentStep: number) {
    return {
      [AddStaffMemberSteps.BasicInformationBlock]: Component.isFormWithoutErrors(forms.basicInformationForm, AddStaffMemberSteps.BasicInformationBlock, currentStep),
      [AddStaffMemberSteps.AddAvatarBlock]: Component.isFormWithoutErrors(forms.uploadPhotoForm, AddStaffMemberSteps.AddAvatarBlock, currentStep),
      [AddStaffMemberSteps.VenuesBlock]: Component.isFormWithoutErrors(forms.venueForm, AddStaffMemberSteps.VenuesBlock, currentStep),
      [AddStaffMemberSteps.ContactDetailsBlock]: Component.isFormWithoutErrors(forms.contactDetailsForm, AddStaffMemberSteps.ContactDetailsBlock, currentStep),
      [AddStaffMemberSteps.WorkBlock]: Component.isFormWithoutErrors(forms.workForm, AddStaffMemberSteps.WorkBlock, currentStep),
      [AddStaffMemberSteps.PreviewBlock]: true
    };
  }

  drawSteps(completedSteps: number, currentStep: number) {
    const stepsValidity = Component.getStepsValidity(this.props.forms, currentStep);

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
