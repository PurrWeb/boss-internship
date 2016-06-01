require 'feature/feature_spec_helper'

RSpec.feature 'Creating a staff member from a user' do
  include ActiveJob::TestHelper

  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:edited_user_name) { FactoryGirl.create(:name, first_name: 'Edited', surname: 'User' ) }
  let!(:edited_user) { FactoryGirl.create(:user, :admin, name: edited_user_name) }
  let!(:venue) { FactoryGirl.create(:venue, creator: dev_user) }
  let!(:staff_type) { FactoryGirl.create(:staff_type) }
  let!(:pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:prospective_staff_member) do
    FactoryGirl.build(
      :staff_member,
      master_venue: venue,
      pay_rate: pay_rate,
      staff_type: staff_type
    )
  end
  let(:create_staff_member_page) { PageObject::CreateStaffMemberFromUserPage.new(edited_user) }
  let(:user_show_page) { PageObject::UserShowPage.new(edited_user) }

  before do
    login_as dev_user
  end

  scenario 'Successfully creating a user for a staff member' do
    perform_enqueued_jobs do
      create_staff_member_page.surf_to
      create_staff_member_page.form.tap do |form|
        form.fill_in_for(prospective_staff_member)
        form.submit
      end
    end

    user_show_page.ensure_flash_success_message_displayed('Staff member added successfully')

    edited_user.reload
    created_staff_member = StaffMember.
      joins(:email_address).
      merge(
        EmailAddress.where(id: edited_user.email_address.id)
      ).
      first

    expect(created_staff_member).to be_present
    expect(created_staff_member.name).to eq(edited_user.name)
    expect(created_staff_member).to eq(edited_user.staff_member)
    expect(
      created_staff_member.employment_status_statement_completed
    ).to eq(true)

    # Send new staff member update email
    expect(ActionMailer::Base.deliveries.count).to eq(1)
    expect(ActionMailer::Base.deliveries.first.subject).to eq("New Staff Member Added - #{created_staff_member.full_name.titlecase}")
  end
end
