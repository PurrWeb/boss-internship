require 'rails_helper'

RSpec.describe GeneralTask, type: :model do
  let!(:user) { FactoryGirl.create(:user) }

  describe 'Associations' do
    it { is_expected.to belong_to :created_by_user }
    it { is_expected.to belong_to :disabled_by_user }
    it { is_expected.to belong_to :venue }
  end

  describe 'Associations' do
    it { validate_presence_of :title }
    it { validate_presence_of :type }
    it { validate_presence_of :due_at }
    it { validate_presence_of :created_by_user }
  end
end
