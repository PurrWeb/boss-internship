import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleDashboard from '~/components/boss-dashboards/simple-dashboard';
import ContentWrapper from '~/components/content-wrapper';
import StaffCountBlock from '../components/staff-count-block';

const blocks = {
  withoutEmail: {
    title: 'Staff without Email Address',
    href: '/staff_members_without_email',
  },
  withoutNI: {
    title: 'Staff without NI Number',
    href: '/staff_members_without_ni_number',
  },
  withoutAddress: {
    title: 'Staff without Address',
    href: '/staff_members_without_address',
  },
  withoutPhoto: {
    title: 'Staff without Photo',
    href: '/staff_members_without_photo',
  },
  wrongPayRate: {
    title: 'Staff On Wrong Pay Rate',
    href: '/staff_members_on_wrong_payrate',
  },
  expiredSIABadge: {
    title: 'Security Staff with Expired SIA Badge',
    href: '/staff_members_with_expired_sia_badge',
  },
  withBouncedEmails: {
    title: 'Staff with Bounced Emails',
    href: '/staff_members_with_bounced_emails',
  },
};

class StaffVetting extends Component {
  render() {
    const {
      staffWithoutEmailCount,
      staffWithoutNiNumberCount,
      staffWithoutAddressCount,
      staffWithoutPhotoCount,
      staffOnWrongPayrateCount,
      staffWithExpiredSiaBadgeCount,
      staffMembersWithBouncedEmailCount,
    } = this.props;
    return (
      <main className="boss-page-main">
        <SimpleDashboard title="Staff Vetting" />
        <ContentWrapper>
          <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting">
            <div className="boss-users">
              <div className="boss-users__stats">
                <div className="boss-users__stats-group">
                  <StaffCountBlock
                    title={blocks.withoutEmail.title}
                    count={staffWithoutEmailCount}
                    href={blocks.withoutEmail.href}
                  />
                  <StaffCountBlock
                    title={blocks.withoutNI.title}
                    count={staffWithoutNiNumberCount}
                    href={blocks.withoutNI.href}
                  />
                </div>
                <div className="boss-users__stats-group">
                  <StaffCountBlock
                    title={blocks.withoutAddress.title}
                    count={staffWithoutAddressCount}
                    href={blocks.withoutAddress.href}
                  />
                  <StaffCountBlock
                    title={blocks.withoutPhoto.title}
                    count={staffWithoutPhotoCount}
                    href={blocks.withoutPhoto.href}
                  />
                </div>
                <div className="boss-users__stats-group">
                  <StaffCountBlock
                    title={blocks.wrongPayRate.title}
                    count={staffOnWrongPayrateCount}
                    href={blocks.wrongPayRate.href}
                  />
                  <StaffCountBlock
                    title={blocks.expiredSIABadge.title}
                    count={staffWithExpiredSiaBadgeCount}
                    href={blocks.expiredSIABadge.href}
                  />
                </div>
                <div className="boss-users__stats-group">
                  <StaffCountBlock
                    title={blocks.withBouncedEmails.title}
                    count={staffMembersWithBouncedEmailCount}
                    href={blocks.withBouncedEmails.href}
                  />
                </div>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </main>
    );
  }
}

StaffVetting.propTypes = {
  staffWithoutEmailCount: PropTypes.number.isRequired,
  staffWithoutNiNumberCount: PropTypes.number.isRequired,
  staffWithoutAddressCount: PropTypes.number.isRequired,
  staffWithoutPhotoCount: PropTypes.number.isRequired,
  staffOnWrongPayrateCount: PropTypes.number.isRequired,
  staffWithExpiredSiaBadgeCount: PropTypes.number.isRequired,
};

export default StaffVetting;
