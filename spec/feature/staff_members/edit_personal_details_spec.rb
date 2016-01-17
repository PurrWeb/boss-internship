require 'feature/feature_spec_helper'

RSpec.feature 'Editing a staff members personal detials' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:edited_staff_member) { FactoryGirl.create(:staff_member) }
  let(:edit_page) { PageObject::StaffMemberEditPersonalDetailsPage.new(edited_staff_member)}
  let(:show_page) { PageObject::StaffMemberShowPage.new(edited_staff_member)}

  before do
    login_as dev_user
  end

  describe 'editing name' do
    let(:new_name) { 'DM325435A' }

    specify 'new number should not match orginal' do
      expect(edited_staff_member.name).
        to_not eq(new_name)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_name(new_name)
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members name' do
      edit_page.surf_to
      edit_page.form.update_name(new_name)
      edited_staff_member.reload
      expect(edited_staff_member.name).to eq(new_name)
    end

    context 'new name is invalid' do
      let!(:old_name) { edited_staff_member.name }
      let(:new_name) { 'INVALIDNUMBER' }

      it 'should return to the edit page with an error message' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edited_staff_member.reload
        edit_page.ensure_flash_error_message_displayed('There was a problem updating this staff member')
      end

      it 'should not update the staff members name' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edited_staff_member.reload
        expect(edited_staff_member.name).to eq(old_name)
      end

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edit_page.form.ui_shows_name(new_name)
      end
    end
  end
end
