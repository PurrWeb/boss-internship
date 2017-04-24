import * as React from 'react';
import {connect} from 'react-redux';
import * as cx from 'classnames';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import StaffMembersReviewList from '../components/staff-members-review-list';

interface Props {
}

interface MappedProps {
}

interface State {
  readonly reviewsShown: boolean;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {
  public unReviewedStaffMembers = [
    {name: 'Igor Pugachev'},
    {name: 'Vasili Pupkin'},
    {name: 'Lyubov Pugacheva'},
  ];

  public reviewedStaffMembers = [
  ];

  constructor() {
    super();

    this.state = {
      reviewsShown: false
    };
  }

  onToggleMenu = () => {
    this.setState({reviewsShown: !this.state.reviewsShown});
  }

  onStuffMemberDismiss = (stuffMember: any) => {
    console.log('Dismissed: ', stuffMember.name);

  }

  onStuffMemberReview = (stuffMember: any) => {
    console.log('Reviewed: ', stuffMember.name);
  }

  render() {
    const reviewContentClassName = cx('boss-dropdown__content', {'boss-dropdown__content_state_opened': this.state.reviewsShown});
    const reviewDropDownClassName = cx('boss-dropdown', {'boss-dropdown__content_state_opened': !this.state.reviewsShown});
    const dropDownArrowClassName = cx(
      'boss-dropdown__switch',
      'boss-dropdown__switch_role_user-review',
      {'boss-dropdown__switch_state_opened': !this.state.reviewsShown});


    return (
      <div className={reviewDropDownClassName}>
        <div className="boss-dropdown__header">
          <a href="javascript:;" onClick={this.onToggleMenu} className={dropDownArrowClassName}>
            Review
          </a>
        </div>
        <div className={reviewContentClassName}>
          <div className="boss-dropdown__content-inner">
            <div className="boss-vetting">
              <div className="boss-vetting__message">
                <div className="boss-alert">
                  <p className="boss-alert__text">
                    Founded <span className="boss-alert__text-value">{this.unReviewedStaffMembers.length}</span> unreviewed staff members
                  </p>
                </div>
              </div>
              <StaffMembersReviewList onCardAction={this.onStuffMemberDismiss} staffMemberList={this.unReviewedStaffMembers} />
              <StaffMembersReviewList onCardAction={this.onStuffMemberReview} staffMemberList={this.reviewedStaffMembers} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  console.log(state);
  return {};
};

export default connect(
  mapStateToProps
)(Component);

