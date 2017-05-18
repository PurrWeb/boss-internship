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

  renderTitle(title: string) {
    return (
      <div className="boss-page-dashboard__group boss-page-dashboard__group_spaced">
        <h1 className="boss-page-dashboard__title">{title}</h1>
      </div>
    );
  }

  render() {
    return (
      <main className="boss-page-main">
        <div className="boss-page-main__dashboard">
          <div className="boss-page-main__inner">
            <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_add-staff-member">
              {this.renderTitle('Add Staff Member')}
              <div className="boss-page-dashboard__group boss-page-dashboard__group_spaced">
                <PassedStepsIndicator/>
              </div>
            </div>
          </div>
        </div>
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner boss-page-main__inner_opaque">
            <div className="boss-page-main__root">
              <FlaggedStaffMembersMessage flaggedStaffMembersCount={this.flaggedStaffMembers().length} />
              <PageAddStaffMember/>
              <StaffMembersReview/>
            </div>
          </div>
        </div>
      </main>
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
