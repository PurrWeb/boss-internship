import * as React from 'react';
import {connect} from 'react-redux';
import {pipe, values, omit, find, not} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, AddStaffMemberStepsInfo} from '../../../interfaces/store-models';
import changingCurrentStep from '../../../action-creators/changing-current-step';
import {AppForms, FormStructure} from '../../../reducers/forms';
import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import {FieldState} from 'react-redux-form';

interface Props {
}

interface MappedProps {
  readonly forms: AppForms;
  readonly sourceImage: string;
  readonly currentStepIdx: number;
  readonly stepsInfo: AddStaffMemberStepsInfo;
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
  [ADD_STAFF_MEMBER_STEPS.VenuesBlock]: true,
  [ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock]: true,
  [ADD_STAFF_MEMBER_STEPS.WorkBlock]: true
};

class Component extends React.Component<PropsFromConnect, State> {
  onStepClick = (step: number) => {
    const action = changingCurrentStep(step);

    this.props.dispatch(action);
  };

  static isFormWithoutErrors(formData: FormStructure<any>, formStepIdx: number, currentStepIdx: number, formValidator?: () => boolean): boolean {
    const isFormInvalid = formValidator ? !formValidator() :
      pipe< FormStructure<any>, {}, FieldState[], FieldState, boolean>(
        omit(['$form']),
        values,
        find((fieldData: FieldState) => fieldData.touched && !fieldData.valid),
        Boolean
      )(formData);

    const isCurrentStepForm = formStepIdx === currentStepIdx;

    if (isCurrentStepForm) {
      return !isFormInvalid;
    } else {
      const isPrevRequiredForm = formStepIdx < currentStepIdx && FormsWithRequiredFields[formStepIdx];

      if (isPrevRequiredForm) {
        return formValidator ? formValidator() : formData.$form.valid;
      } else {
        return true;
      }
    }
  }

  isAvatarFormValid = () => !!this.props.sourceImage;

  getStepsValidity(currentStepIdx: number) {
    const {basicInformationForm, uploadPhotoForm, venueForm, contactDetailsForm, workForm} = this.props.forms;

    return {
      [ADD_STAFF_MEMBER_STEPS.BasicInformationBlock]: Component.isFormWithoutErrors(basicInformationForm, ADD_STAFF_MEMBER_STEPS.BasicInformationBlock, currentStepIdx),
      [ADD_STAFF_MEMBER_STEPS.AddAvatarBlock]: Component.isFormWithoutErrors(uploadPhotoForm, ADD_STAFF_MEMBER_STEPS.AddAvatarBlock, currentStepIdx, this.isAvatarFormValid),
      [ADD_STAFF_MEMBER_STEPS.VenuesBlock]: Component.isFormWithoutErrors(venueForm, ADD_STAFF_MEMBER_STEPS.VenuesBlock, currentStepIdx),
      [ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock]: Component.isFormWithoutErrors(contactDetailsForm, ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock, currentStepIdx),
      [ADD_STAFF_MEMBER_STEPS.WorkBlock]: Component.isFormWithoutErrors(workForm, ADD_STAFF_MEMBER_STEPS.WorkBlock, currentStepIdx),
      [ADD_STAFF_MEMBER_STEPS.PreviewBlock]: true
    };
  }

  drawSteps(currentStepIdx: number) {
    const stepsValidity = this.getStepsValidity(currentStepIdx);
    const {stepsInfo} = this.props;
    const stepsInfoKeys = Object.keys(stepsInfo).map((key) => Number(key));
    const maxStepsInfoIdx = Math.max.apply(null, stepsInfoKeys);
    const stepPreviewIdx = maxStepsInfoIdx + 1;

    return stepsData.map((stepData, idx) => {
      let stepCompleteClassname = '';
      let stepWithErrorClassName = '';
      let isCurrentStep = currentStepIdx === idx;
      const currentStepClassName = isCurrentStep ? 'boss3-steps-block__step-title_state_active' : '';

      let isPreviewStep = idx === stepPreviewIdx;
      if (!isPreviewStep) {
        let stepInfo = stepsInfo[idx];
        let isStepValid = stepsValidity[idx];
        let stepHasUnfilledRequired = stepInfo.hasUnfilledRequired;
        let stepEncounted = stepInfo.visited;

        if (stepEncounted && !stepHasUnfilledRequired) {
          stepCompleteClassname = 'boss3-steps-block__step_state_complete';
        }

        if ( stepEncounted && !isStepValid ) {
          stepWithErrorClassName = 'boss3-steps-block__step_state_with-error';
        }
      }

      return (
        <li key={idx} className={`boss3-steps-block__step ${stepCompleteClassname} ${stepWithErrorClassName}`}>
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
        {this.drawSteps(this.props.currentStepIdx)}
      </ul>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  const {currentStepIdx, sourceImage, stepsInfo} = state.app;

  return {
    forms: state.formsData.forms,
    sourceImage,
    currentStepIdx,
    stepsInfo
  };
};

export default connect(
  mapStateToProps
)(Component);
