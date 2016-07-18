require 'feature/feature_spec_helper'

RSpec.feature 'Disabling a staff member' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:disabled_staff_member) do
    FactoryGirl.create(
      :staff_member,
      user: dev_user,
    ).tap do |staff_member|
      DeleteStaffMember.new(
        requester: dev_user,
        staff_member: staff_member,
        would_rehire: true,
        disable_reason: 'nothing'
      ).call
    end
  end
  let(:staff_member_show_page) { PageObject::StaffMemberShowPage.new(disabled_staff_member) }
  let(:staff_member_enable_page) { PageObject::StaffMemberEnablePage.new(disabled_staff_member) }

  before do
    disabled_staff_member
    login_as dev_user
  end

  scenario 're-enabling disabled staff member' do
    expect(disabled_staff_member).to be_disabled

    staff_member_show_page.surf_to
    staff_member_show_page.click_enable_staff_member_button

    staff_member_enable_page.submit_page

    staff_member_show_page.reload.assert_on_correct_page
    # using find because disabled_staff_member.reload not working for some reason
    expect(StaffMember.find(disabled_staff_member.id)).to be_enabled
  end
end
