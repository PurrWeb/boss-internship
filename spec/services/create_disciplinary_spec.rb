require 'rails_helper'

RSpec.describe CreateDisciplinary, :disciplinary do
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:user_and_staff_member_same_person) { FactoryGirl.create(:staff_member, user: user) }
  let(:valid_params) do
    {
      title: 'Title',
      conduct: 'Some conduct',
      consequence: 'Some consequence',
      nature: 'Some nature',
      created_by_user: user,
      staff_member: staff_member,
      level: 'first_level'
    }
  end
  let(:service) { described_class.new(params: params, requester: user) }

  describe 'before call' do
    it 'no disciplinaries should exist' do
      expect(Disciplinary.count).to eq(0)
    end
  end

  describe 'with valid params' do
    let(:params) { valid_params }
    let!(:result) { service.call }

    it 'should be success' do
      expect(result).to be_success
    end
    it 'should return valid disciplinary' do
      expect(result.disciplinary).to be_valid
    end
    it 'should create disciplinary' do
      expect(Disciplinary.count).to eq(1)
    end
  end

  describe 'with invalid params' do
    let(:params) { valid_params.merge({ title: nil }) }
    let!(:result) { service.call }

    it 'should not be success' do
      expect(result).to_not be_success
    end
    it 'should return invalid disciplinary' do
      expect(result.disciplinary).to_not be_valid
    end
    it 'should not create disciplinary' do
      expect(Disciplinary.count).to eq(0)
    end
  end

  describe 'when user and staff member same person' do
    let(:params) { valid_params.merge({ staff_member: user_and_staff_member_same_person }) }

    it 'raises cancan access denied error' do
      expect { service.call }.to raise_error(CanCan::AccessDenied)
    end

    it 'should not create disciplinary' do
      expect(Disciplinary.count).to eq(0)
    end
  end
end
