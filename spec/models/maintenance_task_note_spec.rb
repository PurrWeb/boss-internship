require 'rails_helper'

RSpec.describe MaintenanceTaskNote, type: :model do
  it { is_expected.to belong_to :maintenance_task }
  it { is_expected.to belong_to :creator_user }
  it { is_expected.to belong_to :disabled_by_user }

  it { validate_presence_of :note }

  describe 'Validations' do
    let!(:user) { FactoryGirl.create(:user) }
    let!(:task_disabled_user) { FactoryGirl.build(:maintenance_task, priority: 0, disabled_by_user: user) }
    let!(:task_disabled_time) { FactoryGirl.build(:maintenance_task, priority: 0, disabled_at: Time.now) }

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
