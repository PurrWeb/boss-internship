require 'feature/feature_spec_helper'

RSpec.feature 'Staff types index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:staff_types_index_page) { StaffTypesIndexPage.new }
  let(:add_staff_type_page) { AddStaffTypePage.new }

  before do
    login_as(dev_user)
  end

  scenario 'the staff members section should be highlighted in the navigaiton' do
    staff_types_index_page.surf_to
    staff_types_index_page.navigation.ensure_only_sections_highlighted(:staff_members)
  end

  scenario 'clicking add new staff type button takes you to the add staff types page' do
    staff_types_index_page.surf_to
    staff_types_index_page.click_add_staff_type_button
    add_staff_type_page.assert_on_correct_page
  end

  context 'Staff Types Exist' do
    let!(:staff_types) { FactoryGirl.create_list(:staff_type, 3) }

    scenario 'The staff types should be listed' do
      staff_types_index_page.surf_to
      staff_types_index_page.ensure_staff_types_listed(type_names: staff_types.map(&:name))
    end
  end
end
