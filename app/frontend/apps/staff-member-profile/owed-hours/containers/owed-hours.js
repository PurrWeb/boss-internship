import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import humanize from 'string-humanize';
import pluralize from 'pluralize';

import DashboardWrapper from '~/components/dashboard-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import Dashboard from '../../common/dashboard';
import StaffMemberCard from '../../common/staff-member-card';
import StaffMemberProfileActions from '../../common/staff-member-profile-actions';
import ContentModal from '~/components/content-modal';

import {
  updateAvatarRequest,
  addNewOwedHours,
  cancelAddNewOwedHours,
  deleteOwedHours
} from '../actions';

import OwedHoursHeader from '../components/owed-hours-header';
import OwedHoursTable from '../components/owed-hours-table';
import AddNewOwedHours from '../components/add-new-owed-hours';
import OwedHoursMobileItems from '../components/owed-hours-mobile-items';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profile','staffMember']),
    owedhours: state.getIn(['profile','owedhours']),
    newOwedHour: state.getIn(['profile', 'newOwedHour']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      updateAvatarRequest,
      addNewOwedHours,
      cancelAddNewOwedHours,
      deleteOwedHours,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class OwedHours extends React.PureComponent {

  constructor(props){
    super(props);
  }
  
  onAddNew = () => {
    this.props.actions.addNewOwedHours();
  }

  onCancelAddNew = () => {
    this.props.actions.cancelAddNewOwedHours();
  }

  render() {

    const {
      staffMember,
      newOwedHour,
      owedhours,
      actions: {
        updateAvatarRequest,
        addNewOwedHours,
        cancelAddNewOwedHours,
        deleteOwedHours,
      }
    } = this.props;

    return (
      <div>
        <DashboardWrapper>
          <Dashboard>
            <StaffMemberCard
              staffMember={staffMember}
              onUpdateAvatar={updateAvatarRequest}
            />
            <StaffMemberProfileActions
              staffMember={staffMember}
            />
          </Dashboard>
        </DashboardWrapper>

        <ContentWrapper>
          <ContentModal
              show={newOwedHour}
              onClose={() => this.onCancelAddNew()}
              title="Add owed hours"
            >
            <AddNewOwedHours
             />
          </ContentModal>
          <section className="boss-board">
            <OwedHoursHeader title="Owed hours" onAddNew={this.onAddNew} />
            <div className="boss-board__main">
              <div className="boss-board__manager">
                <OwedHoursTable owedhours={owedhours} deleteOwedHours={deleteOwedHours} />
                <OwedHoursMobileItems owedhours={owedhours} deleteOwedHours={deleteOwedHours}/>
              </div>
            </div> 
          </section>
        </ContentWrapper>
      </div>
    )
  }
}

export default OwedHours;
