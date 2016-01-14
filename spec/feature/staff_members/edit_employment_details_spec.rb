require 'feature/feature_spec_helper'

RSpec.feature 'Editing a staff_members employment detials' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:edited_staff_member) { FactoryGirl.create(:staff_member) }
  let(:edit_page) { PageObject::StaffMemberEditEmploymentDetailsPage.new(edited_staff_member)}
  let(:show_page) { PageObject::StaffMemberShowPage.new(edited_staff_member)}

  before do
    login_as dev_user
  end

  describe 'editing national insurance number' do
    let(:new_ni_number) { 'DM325435A' }

    specify 'new number should not match orginal' do
      expect(edited_staff_member.national_insurance_number).
        to_not eq(new_ni_number)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_national_insurance_number(new_ni_number)
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members ni number' do
      edit_page.surf_to
      edit_page.form.update_national_insurance_number(new_ni_number)
      edited_staff_member.reload
      expect(edited_staff_member.national_insurance_number).to eq(new_ni_number)
    end

    context 'new ni number is invalid' do
      let!(:old_ni_number) { edited_staff_member.national_insurance_number }
      let(:new_ni_number) { 'INVALIDNUMBER' }

      it 'should return to the edit page with an error message' do
        edit_page.surf_to
        edit_page.form.update_national_insurance_number(new_ni_number)
        edited_staff_member.reload
        edit_page.ensure_flash_error_message_displayed('There was a problem updating this staff member')
      end

      it 'should not update the staff members ni number' do
        edit_page.surf_to
        edit_page.form.update_national_insurance_number(new_ni_number)
        edited_staff_member.reload
        expect(edited_staff_member.national_insurance_number).to eq(old_ni_number)
      end

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.update_national_insurance_number(new_ni_number)
        edit_page.form.ui_shows_national_insurance_number(new_ni_number)
      end
    end
  end
end
