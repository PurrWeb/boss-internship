import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleDashboard from '~/components/boss-dashboards/simple-dashboard';
import ContentWrapper from '~/components/content-wrapper';
import StaffCountBlock from '../components/staff-count-block';
import oFetch from 'o-fetch';

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
      staffMembersWithTimeDodgesCount,
    } = this.props;

    const canViewWithoutAddress = oFetch(this.props, 'permissions.staffWithoutAddress.canView');
    const canViewWithoutEmail = oFetch(this.props, 'permissions.staffWithoutEmail.canView');
    const canViewWithouNiNumber = oFetch(this.props, 'permissions.staffWithoutNiNumber.canView');

    const canViewWithoutPhoto = oFetch(this.props, 'permissions.staffWithoutPhoto.canView');
    const canViewOnWrongPayrate = oFetch(this.props, 'permissions.staffOnWrongPayrate.canView');
    const canViewWithExpiredSiaBadge = oFetch(this.props, 'permissions.staffWithExpiredSiaBadge.canView');
    const canViewWithBouncedEmails = oFetch(this.props, 'permissions.staffWithBouncedEmails.canView');
    const canViewWithTimeDodges = oFetch(this.props, 'permissions.staffWithWithTimeDodges.canView');

    const blocks = {
      withoutEmail: {
        title: 'Staff without Email Address',
        href: '/staff_members_without_email',
        count: staffWithoutEmailCount,
        canView: canViewWithoutEmail,
      },
      withoutNI: {
        title: 'Staff without NI Number',
        href: '/staff_members_without_ni_number',
        count: staffWithoutNiNumberCount,
        canView: canViewWithouNiNumber,
      },
      withoutAddress: {
        title: 'Staff without Address',
        href: '/staff_members_without_address',
        count: staffWithoutAddressCount,
        canView: canViewWithoutAddress,
      },
      withoutPhoto: {
        title: 'Staff without Photo',
        href: '/staff_members_without_photo',
        count: staffWithoutPhotoCount,
        canView: canViewWithoutPhoto,
      },
      wrongPayRate: {
        title: 'Staff On Wrong Pay Rate',
        href: '/staff_members_on_wrong_payrate',
        count: staffOnWrongPayrateCount,
        canView: canViewOnWrongPayrate,
      },
      expiredSIABadge: {
        title: 'Security Staff with Expired SIA Badge',
        href: '/staff_members_with_expired_sia_badge',
        count: staffWithExpiredSiaBadgeCount,
        canView: canViewWithExpiredSiaBadge,
      },
      withBouncedEmails: {
        title: 'Staff with Bounced Emails',
        href: '/staff_members_with_bounced_emails',
        count: staffMembersWithBouncedEmailCount,
        canView: canViewWithBouncedEmails,
      },
      withTimeDodges: {
        title: 'Staff with Time Dodges',
        href: `/staff_members_with_time_dodges`,
        canView: canViewWithTimeDodges,
      },
    };
    const blocksJsx = Object.values(blocks)
      .map(block => {
        if (block.canView) {
          return <StaffCountBlock key={block.title} title={block.title} count={block.count} href={block.href} />;
        }
      })
      .filter(block => !!block);
    const firstRowElements = blocksJsx.slice(0, 2);
    const secondRowElements = blocksJsx.slice(2, 4);
    const thirdRowElements = blocksJsx.slice(4, 6);
    const fourthRowElements = blocksJsx.slice(6, 8);
    return (
      <main className="boss-page-main">
        <SimpleDashboard title="Staff Vetting" />
        <ContentWrapper>
          <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting">
            <div className="boss-users">
              <div className="boss-users__stats">
                {firstRowElements.length > 0 && <div className="boss-users__stats-group">{firstRowElements}</div>}
                {secondRowElements.length > 0 && <div className="boss-users__stats-group">{secondRowElements}</div>}
                {thirdRowElements.length > 0 && <div className="boss-users__stats-group">{thirdRowElements}</div>}
                {fourthRowElements.length > 0 && <div className="boss-users__stats-group">{fourthRowElements}</div>}
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
  staffMembersWithBouncedEmailCount: PropTypes.number.isRequired,
  staffMembersWithTimeDodgesCount: PropTypes.number.isRequired,
};

export default StaffVetting;
