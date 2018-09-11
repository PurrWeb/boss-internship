require "rails_helper"

describe ReviveStaffMember do
  let(:requester) { FactoryGirl.create(:user) }
  let(:sage_id) { 'SAGE_ID' }
  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      :disabled,
      sage_id: sage_id
    )
  end
  let(:starts_at) do
    {staff_member: "params"}
  end
  let(:service) do
    ReviveStaffMember.new(
      requester: requester,
      staff_member: staff_member,
      starts_at: starts_at,
    )
  end

  context "before call" do
    specify "staff member is disabled" do
      expect(staff_member).to be_disabled
    end

    specify "staff member disabled_by_user is not requester" do
      expect(staff_member.disabled_by_user).to_not eq(requester)
    end

    specify 'sage id is set' do
      expect(staff_member.sage_id).to eq(sage_id)
    end
  end

  context "after call" do
    before do
      allow(staff_member).to(
        receive(:assign_attributes)
      )
      allow(staff_member).to receive(:starts_at_changed?).and_return(true)
      allow(staff_member).to receive(:save).and_return(update_result)
    end

    context "when update is successful" do
      let(:update_result) { true }

      specify 'sage id is cleared' do
        expect(staff_member).to receive(:sage_id=).with(nil)
        service.call
      end

      specify 'staff member is updated' do
        expect(staff_member).to(
          receive(:assign_attributes).
            with(starts_at)
        )
        expect(staff_member).to receive(:save).and_return(update_result)
        service.call
      end

      describe "staff member" do
        specify "is enabled" do
          service.call
          expect(staff_member.reload).to be_enabled
        end

        specify "transistions requester id is updated" do
          service.call
          expect(
            staff_member.
              state_machine.
              last_transition.
              metadata.
              fetch("requster_user_id")
          ).to eq(requester.id)
        end
      end

      context "when start_at is not updated" do
        before do
          allow(staff_member).to receive(:starts_at_changed?).and_return(false)
        end

        specify "staff member is not enabled" do
          service.call
          expect(staff_member.reload).to_not be_enabled
        end

        specify "validation error should be set on starts_at" do
          service.call
          expect(staff_member.errors[:starts_at]).to eq(["must change when reactivating staff member"])
        end
      end

      context "when save is unsuccessful" do
        let(:update_result) { false }

        specify "staff member is not enabled" do
          service.call
          expect(staff_member.reload).to_not be_enabled
        end

        specify 'sage id is still set' do
          service.call
          expect(staff_member.reload.sage_id).to eq(sage_id)
        end
      end
    end
  end
end
