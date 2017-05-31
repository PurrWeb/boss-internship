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
    let(:new_name) { FactoryGirl.build(:name, first_name: 'Ian', surname: 'Malcom') }

    specify 'new name should not match orginal' do
      expect(edited_staff_member.name).
        to_not eq(new_name)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_name(new_name)
      edited_staff_member.reload
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members name' do
      edit_page.surf_to
      edit_page.form.update_name(new_name)
      edited_staff_member.reload
      expect(edited_staff_member.name.first_name).to eq(new_name.first_name)
      expect(edited_staff_member.name.surname).to eq(new_name.surname)
    end

    context 'new name is invalid' do
      let!(:old_name) { edited_staff_member.name }
      let(:new_name) { FactoryGirl.build(:name, first_name: '', surname: 'smith') }

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
        expect(edited_staff_member.name.first_name).to eq(old_name.first_name)
        expect(edited_staff_member.name.surname).to eq(old_name.surname)
      end

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edit_page.form.ui_shows_name(new_name)
      end
    end
  end

  describe 'editing gender' do
    let!(:new_gender) { 'male' }

    specify 'new gender should not match orginal' do
      expect(edited_staff_member.gender).
        to_not eq(new_gender)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_gender(new_gender)
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members gender' do
      edit_page.surf_to
      edit_page.form.update_gender(new_gender)
      edited_staff_member.reload
      expect(edited_staff_member.gender).to eq(new_gender)
    end

    context 'form is invalid' do
      let(:invalid_name) { FactoryGirl.build(:name, first_name: '') }

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.tap do |form|
          form.fill_in_name(invalid_name)
          form.select_gender(new_gender)
          form.submit
          form.ui_shows_gender(new_gender)
        end
      end
    end
  end

  describe 'editing date_of_birth' do
    let(:new_date_of_birth) { Date.new(1941, 2, 3) }

    specify 'new date_of_birth should not match orginal' do
      expect(edited_staff_member.date_of_birth).
        to_not eq(new_date_of_birth)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_date_of_birth(new_date_of_birth)
      edited_staff_member.reload
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members date_of_birth' do
      edit_page.surf_to
      edit_page.form.update_date_of_birth(new_date_of_birth)
      edited_staff_member.reload
      expect(edited_staff_member.date_of_birth).to eq(new_date_of_birth)
    end

    context 'form is invalid' do
      let(:invalid_name) { FactoryGirl.build(:name, first_name: '') }

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.tap do |form|
          form.fill_in_name(invalid_name)
          form.fill_in_date_of_birth(new_date_of_birth)
          form.ui_shows_date_of_birth(new_date_of_birth)
        end
      end
    end
  end
end
