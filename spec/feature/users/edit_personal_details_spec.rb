require 'feature/feature_spec_helper'

RSpec.feature 'Editing a users personal detials' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:edited_user) { FactoryGirl.create(:user, :manager) }
  let(:edit_page) { PageObject::UserEditPersonalDetailsPage.new(edited_user)}
  let(:show_page) { PageObject::UserShowPage.new(edited_user)}

  before do
    login_as admin_user
  end

  describe 'editing users name' do
    let(:new_name) do
      FactoryGirl.build(
        :name,
        first_name: 'New',
        surname: 'Name'
      )
    end

    it 'takes you to the show page and show a success message' do
      edit_page.surf_to
      edit_page.form.update_name(new_name)
      edited_user.reload
      show_page.ensure_flash_success_message_displayed('User updated successfully')
    end

    it 'should update the users name' do
      edit_page.surf_to
      edit_page.form.update_name(new_name)
      edited_user.reload
      expect(edited_user.full_name).to eq(new_name.full_name.titlecase)
    end

    context 'new name is invalid' do
      let!(:old_name) { edited_user.full_name.titlecase }

      let(:new_name) do
        FactoryGirl.build(
          :name,
          first_name: nil,
          surname: nil
        )
      end

      it 'should return to the edit page with an error message' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edited_user.reload
        edit_page.ensure_flash_error_message_displayed('There was an issue updating this user')
      end

      it 'should not update the uesrs name' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edited_user.reload
        expect(edited_user.full_name.titlecase).to eq(old_name)
      end

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.update_name(new_name)
        edited_user.reload
        edit_page.form.ui_shows_name(new_name)
      end
    end
  end

  describe 'editing users email' do
    let(:new_email) { 'new.email@fake.com' }

    it 'takes you to the show page and show a success message' do
      edit_page.surf_to
      edit_page.form.update_email(new_email)
      edited_user.reload
      show_page.ensure_flash_success_message_displayed('User updated successfully')
    end

    it 'should update the users email' do
      edit_page.surf_to
      edit_page.form.update_email(new_email)
      edited_user.reload
      expect(edited_user.email).to eq(new_email)
    end

    context 'new email is invalid' do
      let!(:old_email) { edited_user.email }
      let(:new_email) { 'asdsad.asdsa.com' }

      it 'should return to the edit page with an error message' do
        edit_page.surf_to
        edit_page.form.update_email(new_email)
        edited_user.reload
        edit_page.ensure_flash_error_message_displayed('There was an issue updating this user')
      end

      it 'should not update the uesrs email' do
        edit_page.surf_to
        edit_page.form.update_email(new_email)
        edited_user.reload
        expect(edited_user.email).to eq(old_email)
      end

      it 'should persist the edit in the form' do
        edit_page.surf_to
        edit_page.form.update_email(new_email)
        edit_page.form.ui_shows_email(new_email)
      end
    end
  end
end
