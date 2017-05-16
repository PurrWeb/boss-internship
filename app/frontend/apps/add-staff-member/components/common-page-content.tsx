import * as React from 'react';
import {connect} from 'react-redux';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import PageAddStaffMember from './page-add-staff-member';
import PassedStepsIndicator from './passed-steps-indicator';
import StaffMembersReview from '../containers/staff-members-review';
import FlaggedStaffMembersMessage from './flagged-staff-members-message';
import {StaffMember} from '../../../interfaces/staff-member';

interface Props {
}

interface MappedProps {
    readonly flaggedStaffMembers: StaffMember[];
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

class Component extends React.Component<PropsFromConnect, State> {
  flaggedStaffMembers() {
    return this.props.flaggedStaffMembers.filter((staffMember) => !staffMember.reviewed );
  }

  render() {
    return (
      <div
          className="boss-page-content__inner-container"
      >
        <div className="boss-page-dashboard">
          <PassedStepsIndicator/>
        </div>
        <FlaggedStaffMembersMessage flaggedStaffMembersCount={this.flaggedStaffMembers().length} />
        <PageAddStaffMember/>

        <StaffMembersReview/>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    flaggedStaffMembers: state.app.staffMembers,
  };
};

export default connect(
  mapStateToProps
)(Component);
