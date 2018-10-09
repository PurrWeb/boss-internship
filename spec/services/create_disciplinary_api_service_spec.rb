require 'rails_helper'

RSpec.describe CreateDisciplinaryApiService do
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:valid_params) {
    {
      title: 'Title',
      conduct: 'Some conduct',
      consequence: 'Some consequence',
      nature: 'Some nature',
      level: Disciplinary.levels[:first_level]
    }
  }

  let(:service) { described_class.new(requester: user, staff_member: staff_member) }

  describe 'before call' do
    it 'no disciplinaries should exist' do
      expect(Disciplinary.count).to eq(0)
    end
  end

  describe 'with valid params' do
    let(:params) { valid_params }
    let!(:result) { service.call(params: params) }

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
    let!(:result) { service.call(params: params) }

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
end
