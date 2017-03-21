require 'feature/feature_spec_helper'

RSpec.feature 'Adding a new staff member' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:staff_type) { FactoryGirl.create(:staff_type) }
  let(:pay_rate) { FactoryGirl.create(:pay_rate) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:prospective_staff_member) do
    FactoryGirl.build(
      :staff_member,
      master_venue: venue,
      staff_type: staff_type,
      pay_rate: pay_rate
    )
  end
  let(:add_staff_member_page) { PageObject::AddStaffMemberPage.new(user: dev_user) }
  let(:staff_members_index_page) { PageObject::StaffMembersIndexPage.new }

  before do
    pay_rate
    staff_type
    prospective_staff_member
    venue
    login_as dev_user
  end

  scenario 'Successfully adding a new staff member to the system' do
    add_staff_member_page.surf_to

    add_staff_member_page.form.tap do |form|
      form.fill_in_for(prospective_staff_member)
      form.submit
    end

    staff_members_index_page.ensure_flash_success_message_displayed('Staff member added successfully')
    staff_member = StaffMember.joins(:email_address).merge(EmailAddress.where(email: prospective_staff_member.email_address.email)).first
    staff_members_index_page.ensure_record_displayed_for(staff_member)
    expect(staff_member.employment_status_statement_completed).to eq(true)
  end

  scenario 'An uploaded avatar should persists when there is a validation error' do
    add_staff_member_page.surf_to

    add_staff_member_page.form.tap do |form|
      form.upload_avatar_image
      form.submit
      form.ensure_photo_displayed
    end
  end

  context 'when venues exist' do
    let(:venue) { FactoryGirl.create(:venue) }
    let(:prospective_staff_member) do
      FactoryGirl.build(
        :staff_member,
        pay_rate: pay_rate,
        master_venue: venue,
        staff_type: staff_type
      )
    end

    before do
      venue
    end

    scenario 'Adding a staff member with a venue should make it appear against thier name' do
      add_staff_member_page.surf_to

      add_staff_member_page.form.tap do |form|
        form.fill_in_for(prospective_staff_member)
        form.submit
      end

      staff_members_index_page.ensure_flash_success_message_displayed('Staff member added successfully')
      staff_member = StaffMember.joins(:email_address).merge(EmailAddress.where(email: prospective_staff_member.email_address.email)).first
      expect(staff_member.master_venue.id).to eq(venue.id)
    end
  end
end
