import * as React from 'react';
import {connect} from 'react-redux';
import * as cx from 'classnames';
import {Element} from 'react-scroll';
import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import StaffMembersReviewList from '../components/staff-members-review-list';
import store from '../../../store/index';
import toggleStaffMember from '../../../action-creators/toggle-staff-member';
import {toggleReviewed} from '../../../action-creators/reviewed';
import {StaffMember, FlaggedRequestFields} from '../../../interfaces/staff-member';
import { UNREVIEWED_STAFF_MEMBERS, REVIEWED_STAFF_MEMBERS } from '../components/staff-members-review-list';

interface Props {
}

interface MappedProps {
  readonly flaggedStaffMembers: StaffMember[];
  readonly flaggedRequestFields: FlaggedRequestFields;
  readonly isReviewShown: boolean;
}

interface State {
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

class Component extends React.Component<PropsFromConnect, State> {

  onToggleMenu = () => {
    this.props.dispatch(toggleReviewed());
  }

  onStuffMemberDismiss = (stuffMemberId: number) => {
    store.dispatch(toggleStaffMember(stuffMemberId));
  }

  onStuffMemberReview = (stuffMemberId: number) => {
    store.dispatch(toggleStaffMember(stuffMemberId));
  }

  flaggedStaffMembers() {
    return this.props.flaggedStaffMembers.filter((staffMember) => !staffMember.reviewed );
  }

  reviewedStaffMembers() {
    return this.props.flaggedStaffMembers.filter((staffMember) => staffMember.reviewed );
  }

  render() {
    const reviewContentClassName = cx('boss-dropdown__content', {'boss-dropdown__content_state_opened': this.props.isReviewShown});
    const reviewDropDownClassName = cx('boss-dropdown', {'boss-dropdown__content_state_opened': !this.props.isReviewShown});
    const dropDownArrowClassName = cx(
      'boss-dropdown__switch',
      'boss-dropdown__switch_role_user-review',
      {'boss-dropdown__switch_state_opened': !this.props.isReviewShown});


    return (
      <div className="boss-page-content__group">
          <div className={reviewDropDownClassName}>
            <div className="boss-dropdown__header">
              <a href="javascript:;" onClick={this.onToggleMenu} className={dropDownArrowClassName}>
                Review
              </a>
            </div>
            <Element name="reviewBlock" className={reviewContentClassName}>
              <div className="boss-dropdown__content-inner">
                <div className="boss-vetting">
                  { !this.props.flaggedStaffMembers.length && <h3>Nothing to review</h3> }
                  { !!this.flaggedStaffMembers().length && <StaffMembersReviewList listType={UNREVIEWED_STAFF_MEMBERS} onCardAction={this.onStuffMemberDismiss} staffMemberList={ this.flaggedStaffMembers() } /> }
                  { !!this.reviewedStaffMembers().length && <StaffMembersReviewList listType={REVIEWED_STAFF_MEMBERS} onCardAction={this.onStuffMemberReview} staffMemberList={ this.reviewedStaffMembers() } /> }
                </div>
              </div>
            </Element>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    flaggedStaffMembers: state.app.staffMembers,
    flaggedRequestFields: state.app.flaggedFields,
    isReviewShown: state.app.review
  };
};

export default connect(
  mapStateToProps
)(Component);

