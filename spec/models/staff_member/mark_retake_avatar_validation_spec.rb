require 'rails_helper'

describe 'Staff member retake avatar validations' do
  let(:staff_member) { FactoryGirl.build(:staff_member) }

  specify 'should be valid' do
    expect(staff_member).to be_valid
  end

  context 'when marked_retake_avatar_user set on its own' do
    let(:user) { FactoryGirl.create(:user) }

    before do
      staff_member.marked_retake_avatar_user = user
    end

    it 'should not be valid' do
      expect(staff_member).to_not be_valid
      expect(staff_member.errors.to_a).to eq(["Marked retake avatar user must be blank"])
    end
  end

  describe 'marking as retake avatar' do
    before do
      staff_member.marked_retake_avatar_at = Time.current
    end

    context 'when no marked_retake_avatar_user is set' do
      it 'should not be valid' do
        expect(staff_member).to_not be_valid
        expect(staff_member.errors.to_a).to eq(["Marked retake avatar user can't be blank"])
      end
    end
  end

  describe 'override_retake_avatar_restrictions' do
    describe '#override_retake_avatar_restrictions?' do
      it 'should be false by default' do
        expect(
          staff_member.override_retake_avatar_restrictions?
        ).to eq(false)
      end

      context 'when field is set' do
        before do
          staff_member.override_retake_avatar_restrictions = true
        end

        it 'should be true' do
          expect(
            staff_member.override_retake_avatar_restrictions?
          ).to eq(true)
        end
      end
    end
  end
end
