/// <reference path="../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';

import {PropsExtendedByConnect} from '../interfaces/component';
import {StoreStructure} from '../interfaces/store-models';
import BasicInformationBlock from './page-add-staff-member__basic-information-block';
import AddAvatarBlock from './page-add-staff-member__add-avatar-block';
import ContactDetailsBlock from './page-add-staff-member__contact-details-block';
import VenuesBlock from './page-add-staff-member__venues-block';
import WorkBlock from './page-add-staff-member__work-block';
import PreviewBlock from './page-add-staff-member__preview-block';

interface Props {
}

interface MappedProps {
  readonly currentStep: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

const formBlocks: React.ComponentClass<any>[] = [
  BasicInformationBlock,
  AddAvatarBlock,
  VenuesBlock,
  ContactDetailsBlock,
  WorkBlock,
  PreviewBlock
];

class Component extends React.Component<PropsFromConnect, State> {
  renderCurrentFormsBlock() {
    const Block = formBlocks[this.props.currentStep];

    return <Block/>;
  }

  render() {
    return (
      <div className="boss3-page-content">

        {this.renderCurrentFormsBlock()}

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
