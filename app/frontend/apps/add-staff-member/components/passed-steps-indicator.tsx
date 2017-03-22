import * as React from 'react';
import {connect} from 'react-redux';
import {pipe, values, omit, find, not} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import changingCurrentStep from '../../../action-creators/changing-current-step';
import {AppForms, FormStructure} from '../../../reducers/forms';
import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import {FieldState} from 'react-redux-form';

interface Props {
}

interface MappedProps {
  readonly forms: AppForms;
  readonly completedSteps: number;
  readonly sourceImage: string;
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
  [ADD_STAFF_MEMBER_STEPS.BasicInformationBlock]: true,
  [ADD_STAFF_MEMBER_STEPS.AddAvatarBlock]: true,
  [ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock]: true,
  [ADD_STAFF_MEMBER_STEPS.WorkBlock]: true
};

class Component extends React.Component<PropsFromConnect, State> {
  onStepClick = (step: number) => {
    const action = changingCurrentStep(step);

    this.props.dispatch(action);
  };

  static isFormWithoutErrors(formData: FormStructure<any>, formStepIdx: number, currentStep: number, formValidator?: () => boolean): boolean {
    const isFormInvalid = formValidator ? !formValidator() :
      pipe< FormStructure<any>, {}, FieldState[], FieldState, boolean>(
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
        return formValidator ? formValidator() : formData.$form.valid;
      } else {
        return true;
      }
    }
  }

  isAvatarFormValid = () => !!this.props.sourceImage;

  getStepsValidity(currentStep: number) {
    const {basicInformationForm, uploadPhotoForm, venueForm, contactDetailsForm, workForm} = this.props.forms;

    return {
      [ADD_STAFF_MEMBER_STEPS.BasicInformationBlock]: Component.isFormWithoutErrors(basicInformationForm, ADD_STAFF_MEMBER_STEPS.BasicInformationBlock, currentStep),
      [ADD_STAFF_MEMBER_STEPS.AddAvatarBlock]: Component.isFormWithoutErrors(uploadPhotoForm, ADD_STAFF_MEMBER_STEPS.AddAvatarBlock, currentStep, this.isAvatarFormValid),
      [ADD_STAFF_MEMBER_STEPS.VenuesBlock]: Component.isFormWithoutErrors(venueForm, ADD_STAFF_MEMBER_STEPS.VenuesBlock, currentStep),
      [ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock]: Component.isFormWithoutErrors(contactDetailsForm, ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock, currentStep),
      [ADD_STAFF_MEMBER_STEPS.WorkBlock]: Component.isFormWithoutErrors(workForm, ADD_STAFF_MEMBER_STEPS.WorkBlock, currentStep),
      [ADD_STAFF_MEMBER_STEPS.PreviewBlock]: true
    };
  }

  drawSteps(completedSteps: number, currentStep: number) {
    const stepsValidity = this.getStepsValidity(currentStep);

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
  const {completedSteps, currentStep, sourceImage} = state.app;

  return {
    forms: state.formsData.forms,
    completedSteps,
    sourceImage,
    currentStep
  };
};

export default connect(
  mapStateToProps
)(Component);
