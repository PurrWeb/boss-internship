require 'feature/feature_spec_helper'

RSpec.feature 'Flagged staff members page' do
  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:flagged_staff_member_page) { PageObject::FlaggedStaffMemberPage.new }

  before do
    login_as(user)
  end

  scenario 'page should be accessible' do
    flagged_staff_member_page.surf_to
    flagged_staff_member_page.assert_on_correct_page
  end

  context 'non flagged staff members exist' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    before do
      staff_member
    end

    scenario 'staff member should not be listed' do
      flagged_staff_member_page.surf_to
      flagged_staff_member_page.ensure_no_staff_members_found
    end
  end

  context 'flagged staff members exist' do
    let(:staff_member) { FactoryGirl.create(:staff_member, :flagged) }

    before do
      staff_member
    end

    scenario 'staff member should be listed' do
      flagged_staff_member_page.surf_to
      flagged_staff_member_page.ensure_records_returned(1)
      flagged_staff_member_page.
        staff_members_list.
        ensure_details_displayed_for(staff_member)
    end
  end

  context 'user does not have admin access' do
    let(:user) { FactoryGirl.create(:user, :manager) }

    context 'staff member exists from unmanaged venue' do
      let(:staff_member) { FactoryGirl.create(:staff_member, :flagged) }

      before do
        staff_member
      end

      scenario 'staff members from all venues should be listed' do
        flagged_staff_member_page.surf_to
        flagged_staff_member_page.ensure_records_returned(1)
        flagged_staff_member_page.
          staff_members_list.
          ensure_details_displayed_for(staff_member)
      end
    end
  end
end
