require 'rails_helper'

RSpec.describe MaintenanceTask, type: :model do
  let!(:user) { FactoryGirl.create(:user) }

  it { is_expected.to belong_to :venue }
  it { is_expected.to belong_to :creator_user }
  it { is_expected.to belong_to :disabled_by_user }

  it { validate_presence_of :title }
  it { validate_presence_of :description }
  it { validate_presence_of :priority }
  it { validate_presence_of :user }

  describe '#validations' do
    let!(:task_disabled_user) { FactoryGirl.build(:maintenance_task, creator_user: user, priority: 0, disabled_by_user: user) }
    let!(:task_disabled_time) { FactoryGirl.build(:maintenance_task, creator_user: user, priority: 0, disabled_at: Time.now) }

    it 'checks for presence validation for disabled_at when task is disabled' do
      expect(task_disabled_user.valid?).to be_falsey

      expect(task_disabled_user.errors.messages).to include({ disabled_at: ["can't be blank"] })
    end

    it 'checks for presence validation for disabled_by_user when task is disabled' do
      expect(task_disabled_time.valid?).to be_falsey

      expect(task_disabled_time.errors.messages).to include({ disabled_by_user: ["can't be blank"] })
    end
  end

  describe '#state_machine' do
    let!(:task) { FactoryGirl.create(:maintenance_task, creator_user: user) }

    it "default initial state is pending" do
      expect(task.state_machine.current_state).to eq('pending')
    end

    it "cannot transition from and to the same state" do
      expect { task.state_machine.transition_to!(:pending) }.to raise_error(Statesman::TransitionFailedError)
    end

    it "can transition from pending to completed" do
      expect(task.state_machine.transition_to!(:completed)).to be_truthy
      expect(task.state_machine.current_state).to eq('completed')
    end
  end

  describe '#priority' do
    let!(:low_priority_task) { FactoryGirl.build(:maintenance_task, creator_user: user, priority: 0) }
    let!(:medium_priority_task) { FactoryGirl.build(:maintenance_task, creator_user: user, priority: 1) }
    let!(:high_priority_task) { FactoryGirl.build(:maintenance_task, creator_user: user, priority: 2) }

    it 'Maintenance task on low priority when priority is 0' do
      expect(low_priority_task.low_priority?).to be_truthy

      expect(low_priority_task.medium_priority?).to be_falsey
      expect(low_priority_task.high_priority?).to be_falsey
    end

    it 'Maintenance task on medium priority when priority is 1' do
      expect(medium_priority_task.medium_priority?).to be_truthy

      expect(medium_priority_task.low_priority?).to be_falsey
      expect(medium_priority_task.high_priority?).to be_falsey
    end

    it 'Maintenance task on high priority when priority is 2' do
      expect(high_priority_task.high_priority?).to be_truthy

      expect(high_priority_task.low_priority?).to be_falsey
      expect(high_priority_task.medium_priority?).to be_falsey
    end
  end
end
