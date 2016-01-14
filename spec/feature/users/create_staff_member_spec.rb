require 'feature/feature_spec_helper'

RSpec.feature 'Creating a staff member from a user' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let!(:venue) { FactoryGirl.create(:venue, creator: admin_user) }
  let!(:staff_type) { FactoryGirl.create(:staff_type, creator: admin_user) }
  let(:prospective_staff_member) do
    FactoryGirl.build(
      :staff_member,
      venue: venue,
      staff_type: staff_type
    )
  end
  let(:create_staff_member_page) { PageObject::CreateStaffMemberFromUserPage.new(admin_user) }
  let(:user_show_page) { PageObject::UserShowPage.new(admin_user) }

  before do
    login_as admin_user
  end

  scenario 'Successfully creating a user for a staff member' do
    create_staff_member_page.surf_to
    create_staff_member_page.form.tap do |form|
      form.fill_in_for(prospective_staff_member)
      form.submit
    end

    user_show_page.ensure_flash_success_message_displayed('Staff member added successfully')

    admin_user.reload
    created_staff_member = StaffMember.
      joins(:email_address).
      merge(
        EmailAddress.where(id: admin_user.email_address.id)
      ).
      first

    expect(created_staff_member.name).to eq(admin_user.name)
    expect(created_staff_member).to eq(admin_user.staff_member)
  end
end
