import * as React from 'react';
import {connect} from 'react-redux';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import PageAddStaffMember from './page-add-staff-member';
import PassedStepsIndicator from './passed-steps-indicator';

interface Props {
}

interface MappedProps {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  render() {
    return (
      <div
          className="boss3-page-content__inner-container"
      >
        <div className="boss3-page-dashboard">
          <PassedStepsIndicator/>

        </div>

        <PageAddStaffMember/>

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
