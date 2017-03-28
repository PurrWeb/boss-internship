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
import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';

interface Props {
}

interface MappedProps {
  readonly currentStepIdx: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

const formBlocks = {
  [ADD_STAFF_MEMBER_STEPS.BasicInformationBlock]: <BasicInformationBlock/>,
  [ADD_STAFF_MEMBER_STEPS.AddAvatarBlock]: <AddAvatarBlock/>,
  [ADD_STAFF_MEMBER_STEPS.VenuesBlock]: <VenuesBlock/>,
  [ADD_STAFF_MEMBER_STEPS.ContactDetailsBlock]: <ContactDetailsBlock/>,
  [ADD_STAFF_MEMBER_STEPS.WorkBlock]: <WorkBlock/>,
  [ADD_STAFF_MEMBER_STEPS.PreviewBlock]: <PreviewBlock/>,
};

class Component extends React.Component<PropsFromConnect, State> {
  static renderCurrentFormsBlock(currentStepIdx: number) {
    return formBlocks[currentStepIdx] || <BasicInformationBlock/>;
  }

  render() {
    return (
      <div className="boss3-page-content">

        {Component.renderCurrentFormsBlock(this.props.currentStepIdx)}

      </div>

    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    currentStepIdx: state.app.currentStepIdx
  };
};

export default connect(
  mapStateToProps
)(Component);
