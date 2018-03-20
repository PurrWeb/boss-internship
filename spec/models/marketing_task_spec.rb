require 'rails_helper'

RSpec.describe MarketingTask, type: :model do
  let!(:user) { FactoryGirl.create(:user) }

  describe 'Associations' do
    it { is_expected.to belong_to :created_by_user }
    it { is_expected.to belong_to :disabled_by_user }
    it { is_expected.to belong_to :assigned_to_user }
    it { is_expected.to belong_to :venue }
    it { is_expected.to have_many :marketing_task_transitions }
    it { is_expected.to have_many :marketing_task_assignments }
  end

  describe 'Associations' do
    it { validate_presence_of :title }
    it { validate_presence_of :type }
    it { validate_presence_of :due_at }
    it { validate_presence_of :created_by_user }

    let!(:user) { FactoryGirl.create(:user) }
    let!(:general_task) { FactoryGirl.build(:general_task) }
    let!(:task_disabled_user) { FactoryGirl.build(:general_task, disabled_by_user: user, created_by_user: user) }
    let!(:task_disabled_time) { FactoryGirl.build(:general_task, disabled_at: Time.now, created_by_user: user) }

    it 'checks for presence of created_by_user' do
      expect(general_task.valid?).to be_falsey

      expect(general_task.errors.messages).to include({ created_by_user: ["can't be blank"] })
    end

    it 'checks for presence validation for disabled_at when task is disabled' do
      expect(task_disabled_user.valid?).to be_falsey

      expect(task_disabled_user.errors.messages).to include({ disabled_at: ["can't be blank"] })
    end

    it 'checks for presence validation for disabled_by_user when task is disabled' do
      expect(task_disabled_time.valid?).to be_falsey

      expect(task_disabled_time.errors.messages).to include({ disabled_by_user: ["can't be blank"] })
    end
  end
end
