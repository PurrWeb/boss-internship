require 'rails_helper'

RSpec.describe MarketingTaskNote, type: :model do
  it { is_expected.to belong_to :marketing_task }
  it { is_expected.to belong_to :creator_user }
  it { is_expected.to belong_to :disabled_by_user }

  it { validate_presence_of :note }
  it { validate_presence_of :marketing_task }

  describe 'Validations' do
    let!(:user) { FactoryGirl.create(:user) }
    let!(:marketing_task) { FactoryGirl.build(:marketing_task) }
    let!(:note_disabled_user) { FactoryGirl.build(:marketing_task_note, disabled_by_user: user, creator_user: user, marketing_task: marketing_task) }
    let!(:note_disabled_time) { FactoryGirl.build(:marketing_task_note, disabled_at: Time.now, creator_user: user, marketing_task: marketing_task) }

    it 'checks for presence validation for disabled_at when note is disabled' do
      expect(note_disabled_user.valid?).to be_falsey

      expect(note_disabled_user.errors.messages).to include({ disabled_at: ["can't be blank"] })
    end

    it 'checks for presence validation for disabled_by_user when note is disabled' do
      expect(note_disabled_time.valid?).to be_falsey

      expect(note_disabled_time.errors.messages).to include({ disabled_by_user: ["can't be blank"] })
    end
  end
end
