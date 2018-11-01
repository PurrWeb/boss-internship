require "rails_helper"

RSpec.describe DisableDisciplinary, :disciplinary do
  let(:creator) { FactoryGirl.create(:user, :admin) }
  let(:user) { FactoryGirl.create(:user, :admin) }
  let(:user_and_staff_member_same_person) { FactoryGirl.create(:staff_member, user: user) }
  let(:service) { described_class.new(disciplinary: disciplinary, requester: user) }

  context "when requester and disciplinary staff member not the same person" do
    let!(:disciplinary) { FactoryGirl.create(:disciplinary, created_by_user: creator) }

    describe "before call" do
      it "one disciplinaries should exist" do
        expect(Disciplinary.count).to eq(1)
      end
    end

    describe "should disable disciplinary" do
      let!(:result) { service.call }

      it "should be success" do
        expect(result).to be_success
      end
      it "should return valid disciplinary" do
        expect(result.disciplinary).to be_valid
      end
      it "should disable disciplinary" do
        expect(disciplinary.disabled?).to eq(true)
      end
    end
  end

  context "when requester and disciplinary staff member same person" do
    let!(:disciplinary) { FactoryGirl.create(:disciplinary, created_by_user: creator, staff_member: user_and_staff_member_same_person) }

    it "raises cancan access denied error" do
      expect { service.call }.to raise_error(CanCan::AccessDenied)
    end

    it "should not disable disciplinary" do
      expect(disciplinary.disabled?).to eq(false)
    end
  end
end
