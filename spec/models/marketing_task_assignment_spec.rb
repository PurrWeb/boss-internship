require 'rails_helper'

RSpec.describe MarketingTaskAssignment, type: :model do
  let!(:user) { FactoryGirl.create(:user) }

  describe 'Associations' do
    it { is_expected.to belong_to :marketing_task }
    it { is_expected.to belong_to :user }
  end

  describe 'Associations' do
    it { validate_presence_of :state }
    it { validate_presence_of :marketing_task }
    it { validate_presence_of :user }
    it { validate_inclusion_of(:state).in_array(%w[assigned unassigned]) }
  end
end
