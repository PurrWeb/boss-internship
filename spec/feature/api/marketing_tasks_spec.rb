require "rails_helper"

RSpec.describe 'Marketing Task Request Specs', type: :request do
  let!(:staff_member) { FactoryGirl.create(:staff_member) }
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:user) { FactoryGirl.create(:user, :manager, venues: [venue]) }
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let!(:marketing_staff_user) { FactoryGirl.create(:user, :marketing_staff) }
  let!(:user_without_venue_access) { FactoryGirl.create(:user, :manager, venues: []) }
  let!(:marketing_task) { FactoryGirl.create(:marketing_task, venue: venue, created_by_user: user, type: 'ArtworkTask') }

  describe '#change_status' do
    it 'Raises cancan access denied error if user does not have permission' do
      expect do
        put change_status_api_v1_marketing_task_path(marketing_task), {}, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      put change_status_api_v1_marketing_task_path(marketing_task), {}, invalid_token_header

      expect(response.status).to eq(401)
    end

    context 'when user is admin' do
      it 'returns unprocessible entity when status is not in allowed transitions' do
        attributes = { status: 'accepted' }

        put change_status_api_v1_marketing_task_path(marketing_task), attributes, token_header(admin_user)

        marketing_task_json = JSON.parse(response.body)

        expect(response.status).to eq(422)
        expect(marketing_task_json.fetch('transition_to')).to eq(['transition not allowed'])
      end

      it 'changes status of marketing task when token is valid and param is correct' do
        attributes = { status: 'completed' }

        put(change_status_api_v1_marketing_task_path(marketing_task), attributes, token_header(admin_user))

        expect(response.status).to eq(200)
      end
    end

    context 'when user is marketing staff' do
      it 'returns unprocessible entity when status is not in allowed transitions' do
        marketing_task.state_machine.transition_to!(:completed, requester_user_id: user.id)

        attributes = { status: 'accepted' }
        put(change_status_api_v1_marketing_task_path(marketing_task), attributes, token_header(marketing_staff_user))

        marketing_task_json = JSON.parse(response.body)

        expect(response.status).to eq(422)
        expect(marketing_task_json.fetch('transition_to')).to eq(['transition not allowed'])
      end

      it 'changes status of marketing task when token is valid and param is correct' do
        attributes = { status: 'completed' }

        put(change_status_api_v1_marketing_task_path(marketing_task), attributes, token_header(marketing_staff_user))

        expect(response.status).to eq(200)
      end
    end
  end

  describe '#add_note' do
    it 'Raises cancan access denied error if user does not have permission' do
      attributes = { marketing_task_id: marketing_task.id }

      expect do
        post notes_api_v1_marketing_task_path(marketing_task), attributes, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
        post notes_api_v1_marketing_task_path(marketing_task), {}, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns unprocessible entity when status is not in allowed transitions' do
      attributes = { marketing_task_id: marketing_task.id, note: '' }

      post notes_api_v1_marketing_task_path(marketing_task), attributes, token_header(admin_user)

      marketing_task_json = JSON.parse(response.body)

      expect(response.status).to eq(422)
      expect(marketing_task_json.fetch('note')).to eq(["can't be blank"])
    end

    it 'changes status of marketing task when token is valid and param is correct' do
      attributes = { marketing_task_id: marketing_task.id, note: 'Testing' }

      post notes_api_v1_marketing_task_path(marketing_task), attributes, token_header(admin_user)

      marketing_task_note_json = JSON.parse(response.body)

      expect(response.status).to eq(201)
      expect(marketing_task_note_json.fetch('note')).to eq('Testing')
    end
  end

  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unprocessable_entity_status
    422
  end
end
