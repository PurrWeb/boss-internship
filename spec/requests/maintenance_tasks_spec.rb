require "rails_helper"

RSpec.describe 'Maintenance Task Request Specs', type: :request do
  let!(:staff_member) { FactoryGirl.create(:staff_member) }
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let!(:maintenance_staff_user) { FactoryGirl.create(:user, venues: [venue], role: 'maintenance_staff') }
  let!(:user_without_venue_access) { FactoryGirl.create(:user) }
  let!(:maintenance_task) { FactoryGirl.create(:maintenance_task, venue: venue, creator_user: user) }

  describe '#show' do
    it 'Returns 401 error if token is invalid' do
      get "/api/v1/maintenance_tasks/#{maintenance_task.id}", { venue_id: venue.id }, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'Raises cancan access denied error if user does not have permission' do
      expect do
        get "/api/v1/maintenance_tasks/#{maintenance_task.id}", { venue_id: venue.id }, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns maintenance task if token is valid' do
      get "/api/v1/maintenance_tasks/#{maintenance_task.id}", { venue_id: venue.id }, token_header(user)

      maintenance_task_json = JSON.parse(response.body)

      expect(response.status).to eq 200
      expect(maintenance_task_json.fetch('id')).to eq(maintenance_task.id)
      expect(maintenance_task_json.fetch('venue').fetch('id')).to eq(venue.id)
    end
  end

  describe '#update' do
    it 'Raises cancan access denied error if user does not have permission' do
      attributes = { venue_id: venue.id }

      expect do
        put "/api/v1/maintenance_tasks/#{maintenance_task.id}", attributes, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      attributes = { venue_id: venue.id }

      put "/api/v1/maintenance_tasks/#{maintenance_task.id}", attributes, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns unprocessible entity when validations fail' do
      attributes = { venue_id: venue.id, title: '', description: '', priority: '' }

      put "/api/v1/maintenance_tasks/#{maintenance_task.id}", attributes, token_header(user)

      maintenance_task_json = JSON.parse(response.body)

      expect(response.status).to eq(422)
      expect(maintenance_task_json.fetch('title')).to eq(["can't be blank"])
      expect(maintenance_task_json.fetch('description')).to eq(["can't be blank"])
      expect(maintenance_task_json.fetch('priority')).to eq(["can't be blank"])
    end

    it 'creates a maintenance task when all attributes are passed and token is valid' do
      attributes = { venue_id: venue.id, title: 'Updated Title', description: 'Updated Description', priority: 'low_priority' }

      put "/api/v1/maintenance_tasks/#{maintenance_task.id}", attributes, token_header(user)

      maintenance_task_json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(maintenance_task_json.fetch('title')).to eq('Updated Title')
      expect(maintenance_task_json.fetch('description')).to eq('Updated Description')
      expect(maintenance_task_json.fetch('priority')).to eq('low_priority')
    end
  end

  describe '#create' do
    it 'Raises cancan access denied error if user does not have permission' do
      attributes = { venue_id: venue.id }

      expect do
        post '/api/v1/maintenance_tasks', attributes, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      attributes = { venue_id: venue.id }

      post '/api/v1/maintenance_tasks', attributes, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns unprocessible entity when validations fail' do
      attributes = { venue_id: venue.id, title: '', description: '', priority: '' }

      post '/api/v1/maintenance_tasks', attributes, token_header(user)

      maintenance_task_json = JSON.parse(response.body)

      expect(response.status).to eq(422)
      expect(maintenance_task_json.fetch('title')).to eq(["can't be blank"])
      expect(maintenance_task_json.fetch('description')).to eq(["can't be blank"])
      expect(maintenance_task_json.fetch('priority')).to eq(["can't be blank"])
    end

    it 'creates a maintenance task when all attributes are passed and token is valid' do
      attributes = { venue_id: venue.id, title: 'Title', description: 'Description', priority: 'high_priority' }

      post '/api/v1/maintenance_tasks', attributes, token_header(user)

      maintenance_task_json = JSON.parse(response.body)

      expect(response.status).to eq(201)
      expect(maintenance_task_json.fetch('title')).to eq('Title')
      expect(maintenance_task_json.fetch('description')).to eq('Description')
    end
  end

  describe '#change_status' do
    it 'Raises cancan access denied error if user does not have permission' do
      attributes = { venue_id: venue.id }

      expect do
        post "/api/v1/maintenance_tasks/#{maintenance_task.id}/change_status", attributes, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      attributes = { venue_id: venue.id }

      post "/api/v1/maintenance_tasks/#{maintenance_task.id}/change_status", attributes, invalid_token_header

      expect(response.status).to eq(401)
    end

    context 'when user is admin' do
      it 'returns unprocessible entity when status is not in allowed transitions' do
        attributes = { venue_id: venue.id, status: 'accepted' }

        post "/api/v1/maintenance_tasks/#{maintenance_task.id}/change_status", attributes, token_header(user)

        maintenance_task_json = JSON.parse(response.body)

        expect(response.status).to eq(422)
        expect(maintenance_task_json.fetch('transition_to')).to eq(['transition not allowed'])
      end

      it 'changes status of maintenance task when token is valid and param is correct' do
        attributes = { venue_id: venue.id, status: 'completed' }

        post "/api/v1/maintenance_tasks/#{maintenance_task.id}/change_status", attributes, token_header(user)

        maintenance_task_json = JSON.parse(response.body)
        expect(response.status).to eq(200)
      end
    end

    context 'when user is maintenance staff' do
      it 'returns unprocessible entity when status is not in allowed transitions' do
        maintenance_task.state_machine.transition_to!(:completed, requester_user_id: user.id)

        attributes = { venue_id: venue.id, status: 'accepted' }

        post "/api/v1/maintenance_tasks/#{maintenance_task.id}/change_status", attributes, token_header(maintenance_staff_user)

        maintenance_task_json = JSON.parse(response.body)

        expect(response.status).to eq(422)
        expect(maintenance_task_json.fetch('transition_to')).to eq(['transition not allowed'])
      end

      it 'changes status of maintenance task when token is valid and param is correct' do
        attributes = { venue_id: venue.id, status: 'completed' }

        post "/api/v1/maintenance_tasks/#{maintenance_task.id}/change_status", attributes, token_header(maintenance_staff_user)

        maintenance_task_json = JSON.parse(response.body)
        expect(response.status).to eq(200)
      end
    end
  end

  describe '#add_note' do
    it 'Raises cancan access denied error if user does not have permission' do
      attributes = { venue_id: venue.id, maintenance_task_id: maintenance_task.id }

      expect do
        post "/api/v1/maintenance_tasks/#{maintenance_task.id}/add_note", attributes, token_header(user_without_venue_access)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      attributes = { venue_id: venue.id }

      post "/api/v1/maintenance_tasks/#{maintenance_task.id}/add_note", attributes, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns unprocessible entity when status is not in allowed transitions' do
      attributes = { venue_id: venue.id, maintenance_task_id: maintenance_task.id, note: '' }

      post "/api/v1/maintenance_tasks/#{maintenance_task.id}/add_note", attributes, token_header(user)

      maintenance_task_json = JSON.parse(response.body)

      expect(response.status).to eq(422)
      expect(maintenance_task_json.fetch('note')).to eq(["can't be blank"])
    end

    it 'changes status of maintenance task when token is valid and param is correct' do
      attributes = { venue_id: venue.id, maintenance_task_id: maintenance_task.id, note: 'Testing' }

      post "/api/v1/maintenance_tasks/#{maintenance_task.id}/add_note", attributes, token_header(user)

      maintenance_task_note_json = JSON.parse(response.body)

      expect(response.status).to eq(201)
      expect(maintenance_task_note_json.fetch('note')).to eq('Testing')
    end
  end
end
