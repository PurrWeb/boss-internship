import * as React from 'react';
import {connect} from 'react-redux';
import {pipe, values, omit, find, not} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, AddStaffMemberStepsInfo} from '../../../interfaces/store-models';
import changeStep from '../../../action-creators/current-step-changed';

import {AppForms, FormStructure} from '../../../reducers/forms';
import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import {FieldState} from 'react-redux-form';
import * as _ from 'lodash';

interface Props {
}

interface MappedProps {
  readonly forms: AppForms;
  readonly sourceImage: string;
  readonly currentStepIdx: number;
  readonly stepsInfo: AddStaffMemberStepsInfo;
  readonly unReviewedStaffMembers: any;
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
    title: 'Address'
  },
  {
    title: 'Work'
  },
  {
    title: 'Venue'
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
  onStepClick = (step: number, form: any) => {
    let model = !!form ? form.$form.model : '';
    this.props.dispatch(changeStep(model, step));
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
  isStaffMembersReviewed = () => !this.props.unReviewedStaffMembers();

  getStepsValidity(currentStepIdx: number) {
    const {basicInformationForm, uploadPhotoForm, venueForm, contactDetailsForm, workForm} = this.props.forms;
    return {
      [ADD_STAFF_MEMBER_STEPS.BasicInformationBlock]: {form: basicInformationForm, errors: Component.isFormWithoutErrors(basicInformationForm, ADD_STAFF_MEMBER_STEPS.BasicInformationBlock, currentStepIdx)},
      [ADD_STAFF_MEMBER_STEPS.AddAvatarBlock]: {form: uploadPhotoForm, errors: Component.isFormWithoutErrors(uploadPhotoForm, ADD_STAFF_MEMBER_STEPS.AddAvatarBlock, currentStepIdx, this.isAvatarFormValid)},
      [ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock]: {form: contactDetailsForm, errors: Component.isFormWithoutErrors(contactDetailsForm, ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock, currentStepIdx)},
      [ADD_STAFF_MEMBER_STEPS.WorkBlock]: {form: workForm, errors: Component.isFormWithoutErrors(workForm, ADD_STAFF_MEMBER_STEPS.WorkBlock, currentStepIdx)},
      [ADD_STAFF_MEMBER_STEPS.VenuesBlock]: {form: venueForm, errors: Component.isFormWithoutErrors(venueForm, ADD_STAFF_MEMBER_STEPS.VenuesBlock, currentStepIdx)},
      [ADD_STAFF_MEMBER_STEPS.PreviewBlock]: {form: null, errors: true}
    };
  }

  isLineBefore(stepsValidity: any, idx: number, isFirst: boolean, isLast: boolean) {
    if (isFirst) {
      return false;
    }
    let isPreviousValid = (stepsValidity[idx - 1].form.$form.valid && stepsValidity[idx - 1].form.$form.touched);
    let isCurrentValid = isLast ? true : (stepsValidity[idx].form.$form.valid && stepsValidity[idx].form.$form.touched);
    return isPreviousValid && isCurrentValid;
  }

  isLineAfter(stepsValidity: any, idx: number, isFirst: boolean, isLast: boolean, lastStepIdx: number) {
    if (isLast) {
      return false;
    }
    let isCurrentValid = (stepsValidity[idx].form.$form.valid && stepsValidity[idx].form.$form.touched);
    if ((idx + 1 === lastStepIdx)) {
      if (isCurrentValid) {
        return true;
      }
      return false;
    }
    let isNextValid = (stepsValidity[idx + 1].form.$form.valid && stepsValidity[idx + 1].form.$form.touched);
    return isNextValid && isCurrentValid;
  }

  isAllFormsValid(formsData: any, hasUnreviewedStaffMembers: boolean) {
    let isFieldsValid = true;
    _.each(formsData, (formData: any) => {
      if (!formData.visited || formData.hasUnfilledRequired || formData.hasValidationErrors) {
        isFieldsValid = false;
      } else {
        isFieldsValid = true;
      }
    });
    return isFieldsValid && !hasUnreviewedStaffMembers;
  }

  drawSteps(currentStepIdx: number) {
    const stepsValidity = this.getStepsValidity(currentStepIdx);
    console.log(stepsValidity);
    const {stepsInfo} = this.props;
    const stepsInfoKeys = Object.keys(stepsInfo).map((key) => Number(key));
    const maxStepsInfoIdx = Math.max.apply(null, stepsInfoKeys);
    const lastStepIdx = maxStepsInfoIdx + 1;
    return stepsData.map((stepData, idx) => {
      let stepCompleteClassname = '';
      let stepWithErrorClassName = '';

      let isFirstStep = idx === 0;
      let isLastStep = idx === lastStepIdx;
      let isCurrentStep = currentStepIdx === idx;

      const currentForm = stepsValidity[currentStepIdx].form;
      let isLineBefore = this.isLineBefore(stepsValidity, idx, isFirstStep, isLastStep);
      let isLineAfter = this.isLineAfter(stepsValidity, idx, isFirstStep, isLastStep, lastStepIdx);

      const lineBeforeClassName = isLineBefore ? 'boss-steps__step-line_state_completed' : '';
      const lineAfterClassName = isLineAfter ? 'boss-steps__step-line_state_completed' : '';

      const currentStepClassName = isCurrentStep ? 'boss-steps__step-title_state_active' : '';
      const unReviewedClassName = (idx === 0 && !this.isStaffMembersReviewed()) ? 'boss-steps-block__step_state_review-error' : '';
      if (isLastStep) {
        if (this.isAllFormsValid(stepsInfo, this.props.unReviewedStaffMembers())) {
          stepCompleteClassname = 'boss-steps__step-index_state_completed';
        }
      }
      if (!isLastStep) {
        let stepInfo = stepsInfo[idx];

        let stepHasUnfilledRequired = stepInfo.hasUnfilledRequired;
        let stepHasValidationError = stepInfo.hasValidationErrors;
        let isVisited = stepInfo.visited;

        let isShowError = (isVisited && stepHasUnfilledRequired) || stepHasValidationError;
        let isCompleted = isVisited && !stepHasUnfilledRequired;


        if ( isCompleted ) {
          stepCompleteClassname = 'boss-steps__step-index_state_completed';
        }

        if ( isShowError ) {
          stepWithErrorClassName = `boss-steps__step-index_state_with-error`;
        }
      }

      return (
        <div key={idx} className="boss-steps__step">
          { !isFirstStep && <div className={`boss-steps__step-line boss-steps__step-line_before ${lineBeforeClassName}`}></div>}
          <div
              className={`boss-steps__step-index ${stepWithErrorClassName} ${stepCompleteClassname}`}
              onClick={() => {
                this.onStepClick(idx, currentForm);
              }}
          >
            {idx + 1}
          </div>
          <div className={`boss-steps__step-title ${currentStepClassName}`}>{stepData.title}</div>
          {!isLastStep && <div className={`boss-steps__step-line boss-steps__step-line_after ${lineAfterClassName}`}></div>}
        </div>
      );
    });
  }

  render() {
    return (
      <ul className="boss-steps">
        {this.drawSteps(this.props.currentStepIdx)}
      </ul>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  const {currentStepIdx, sourceImage, stepsInfo} = state.app;

  return {
    forms: state.formsData.forms,
    unReviewedStaffMembers: () => {
      return !!state.app.staffMembers.filter((item) => !item.reviewed).length;
    },
    sourceImage,
    currentStepIdx,
    stepsInfo
  };
};

export default connect(
  mapStateToProps
)(Component);
