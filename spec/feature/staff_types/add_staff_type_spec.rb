require 'feature/feature_spec_helper'

RSpec.feature 'Adding a new staff type' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:staff_type_name) { 'Hard Worker' }
  let(:add_staff_type_page) { AddStaffTypePage.new }
  let(:staff_types_index_page) { StaffTypesIndexPage.new }

  before do
    login_as admin_user
  end

  scenario 'Successfully adding a new user to the system' do
    add_staff_type_page.surf_to

    add_staff_type_page.fill_and_submit_form(name: staff_type_name)

    staff_types_index_page.ensure_flash_success_message_displayed('Staff type added successfully')
    staff_types_index_page.ensure_staff_types_listed(type_names: staff_type_name)
  end

  scenario 'Invalid staff type causes error message' do
    add_staff_type_page.surf_to

    add_staff_type_page.submit_form

    add_staff_type_page.ensure_flash_error_message_displayed('Staff type could not be added')
  end

  context 'staff types exists' do
    let!(:staff_type) { FactoryGirl.create(:staff_type, name: staff_type_name) }

    scenario 'Attempt to create staff type with same name as existing' do
      expect(StaffType.count).to eq(1)
      add_staff_type_page.surf_to

      add_staff_type_page.fill_and_submit_form(name: staff_type_name)
      add_staff_type_page.ensure_flash_error_message_displayed('Staff type could not be added')
      expect(StaffType.count).to eq(1)
    end
  end
end
