/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import BasicInformationBlock from './page-add-staff-member__basic-information-block';
import AddAvatarBlock from './page-add-staff-member__add-avatar-block';
import ContactDetailsBlock from './page-add-staff-member__contact-details-block';
import VenuesBlock from './page-add-staff-member__venues-block';
import WorkBlock from './page-add-staff-member__work-block';
import PreviewBlock from './page-add-staff-member__preview-block';
import {AddStaffMemberSteps} from '../../../constants/other';

interface Props {
}

interface MappedProps {
  readonly currentStep: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

const formBlocks = {
  [AddStaffMemberSteps.BasicInformationBlock]: <BasicInformationBlock/>,
  [AddStaffMemberSteps.AddAvatarBlock]: <AddAvatarBlock/>,
  [AddStaffMemberSteps.VenuesBlock]: <VenuesBlock/>,
  [AddStaffMemberSteps.ContactDetailsBlock]: <ContactDetailsBlock/>,
  [AddStaffMemberSteps.WorkBlock]: <WorkBlock/>,
  [AddStaffMemberSteps.PreviewBlock]: <PreviewBlock/>,
};

class Component extends React.Component<PropsFromConnect, State> {
  static renderCurrentFormsBlock(currentStep: number) {
    return formBlocks[currentStep] || <BasicInformationBlock/>;
  }

  render() {
    return (
      <div className="boss-page-content">

        {Component.renderCurrentFormsBlock(this.props.currentStep)}

      </div>

    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    currentStep: state.app.currentStep
  };
};

export default connect(
  mapStateToProps
)(Component);
