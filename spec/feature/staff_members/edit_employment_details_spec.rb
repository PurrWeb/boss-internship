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

  describe 'editing master venue' do
    let!(:new_venue) { FactoryGirl.create(:venue, name: 'newest venue') }

    before do
      new_venue
    end

    specify 'new number should not match orginal' do
      expect(edited_staff_member.master_venue).
        to_not eq(new_venue)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_master_venue(new_venue)
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members venue' do
      edit_page.surf_to
      edit_page.form.update_master_venue(new_venue)
      edited_staff_member.reload
      expect(edited_staff_member.master_venue).to eq(new_venue)
    end

    context 'form is invalid' do
      let(:invalid_ni_number) { 'INVAFSD_DSAD12213ASDADS' }

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.tap do |form|
          form.select_national_insurance_number(invalid_ni_number)
          form.select_master_venue(new_venue)
          form.submit
          form.ui_shows_master_venue(new_venue)
        end
      end
    end
  end

  describe 'editing other venues' do
    let!(:new_venue) { FactoryGirl.create(:venue, name: 'newest venue') }

    specify 'new venues should not match orginal' do
      expect(edited_staff_member.work_venues).
        to_not eq([new_venue])
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_work_venues([new_venue])
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members venues' do
      edit_page.surf_to
      edit_page.form.update_work_venues([new_venue])
      edited_staff_member.reload
      expect(edited_staff_member.work_venues.to_a).to eq([new_venue])
    end

    context 'form is invalid' do
      let(:invalid_ni_number) { 'INVAFSD_DSAD12213ASDADS' }

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.tap do |form|
          form.select_national_insurance_number(invalid_ni_number)
          form.select_work_venues([new_venue])
          form.submit
          form.ui_shows_work_venues([new_venue])
        end
      end
    end
  end

  describe 'editing staff_type' do
    let!(:new_staff_type) { FactoryGirl.create(:staff_type, name: 'newest staff_type') }

    specify 'new number should not match orginal' do
      expect(edited_staff_member.staff_type).
        to_not eq(new_staff_type)
    end

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_staff_type(new_staff_type)
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members staff type' do
      edit_page.surf_to
      edit_page.form.update_staff_type(new_staff_type)
      edited_staff_member.reload
      expect(edited_staff_member.staff_type).to eq(new_staff_type)
    end

    context 'form is invalid' do
      let(:invalid_ni_number) { 'INVAFSD_DSAD12213ASDADS' }

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.tap do |form|
          form.select_national_insurance_number(invalid_ni_number)
          form.select_staff_type(new_staff_type)
          form.submit
          form.ui_shows_staff_type(new_staff_type)
        end
      end
    end
  end

  describe 'editing start date' do
    let(:new_start_date) { edited_staff_member.starts_at - 3.months }

    it 'takes you to the show page and shows a success message' do
      edit_page.surf_to
      edit_page.form.update_start_date(new_start_date)
      edited_staff_member.reload
      show_page.ensure_flash_success_message_displayed('Staff member updated successfully')
    end

    it 'should update the staff members start_date' do
      edit_page.surf_to
      edit_page.form.update_start_date(new_start_date)
      edited_staff_member.reload
      expect(edited_staff_member.starts_at).to eq(new_start_date)
    end
  end
end
