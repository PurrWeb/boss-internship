require 'feature/feature_spec_helper'

RSpec.feature 'Editing a users access detials' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:edit_page) { PageObject::UserEditAccessDetailsPage.new(edited_user)}
  let(:show_page) { PageObject::UserShowPage.new(edited_user)}

  before do
    login_as admin_user
  end

  describe 'editing users role' do
    let(:new_role) { 'admin' }

    context 'when editing a user whos role you can edit' do
      let(:edited_user) { FactoryGirl.create(:user, :manager) }

      it 'takes you to the show page and show a success message' do
        edit_page.surf_to
        edit_page.form.update_role(new_role)
        edited_user.reload
        show_page.ensure_flash_success_message_displayed('User updated successfully')
      end

      it 'should update the users role' do
        edit_page.surf_to
        edit_page.form.update_role(new_role)
        edited_user.reload
        expect(edited_user.role).to eq(new_role)
      end
    end

    context 'when editing a user whos role you cant edit' do
      let(:edited_user) { FactoryGirl.create(:user, :dev) }

      it 'should display the role in a defintion list' do
        edit_page.surf_to
        edit_page.ensure_role_displayed(edited_user.role)
      end
    end
  end

  describe 'editing a users venues' do
    before do
      venues
    end

    context 'user is manger' do
      let(:edited_user) { FactoryGirl.create(:user, :dev) }
      let(:venues) { FactoryGirl.create_list(:venue, 3) }

      specify 'manager is not set up to manage venues' do
        expect(edited_user.venues).to eq([])
      end

      it 'takes you to the show page and show a success message' do
        edit_page.surf_to
        edit_page.form.update_venues(venues)
        edited_user.reload
        show_page.ensure_flash_success_message_displayed('User updated successfully')
      end
    end
  end
end
