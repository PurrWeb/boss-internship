import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class StaffMember extends PureComponent {


  render() {
    const staffMember = oFetch(this.props, 'staffMember');
    const staffMemberId = oFetch(staffMember, 'id');
    const rotaShifts = oFetch(staffMember, 'rotaShifts');
    const avatarUrl = oFetch(staffMember, 'avatarUrl');
    const firstName = oFetch(staffMember, 'firstName');
    const surname = oFetch(staffMember, 'surname');
    const { isDisabled } = this.props;
    const fullName = `${firstName} ${surname}`;
    return (
      <div
        className={`boss-table__row ${isDisabled && 'boss-table__row_faded'}`}
      >
        <div className="boss-table__cell">
          <div className="boss-user-summary boss-user-summary_role_ssr-assign">
            <div className="boss-user-summary__side">
              <div className="boss-user-summary__avatar">
                <div className="boss-user-summary__avatar-inner">
                  <img
                    src={avatarUrl}
                    alt="user avatar"
                    className="boss-user-summary__pic"
                  />
                </div>
              </div>
            </div>
            <div className="boss-user-summary__content boss-user-summary__content_adjust_middle">
              <div className="boss-user-summary__header">
                <h3 className="boss-user-summary__name">{fullName}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="boss-table__cell">
          <button
            onClick={() =>
              this.props.handleOpenConfirmationModal({
                avatarUrl,
                fullName,
                staffMemberId,
                rotaShifts,
              })
            }
            className="boss-button boss-button_type_extra-small boss-button_role_confirm"
          >
            Assign
          </button>
        </div>
      </div>
    );
  }
}

StaffMember.propTypes = {
  staffMember: PropTypes.object.isRequired,
  shiftRequest: PropTypes.object.isRequired,
  handleOpenConfirmationModal: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default StaffMember;
