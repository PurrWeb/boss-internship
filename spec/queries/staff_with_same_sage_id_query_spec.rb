require "rails_helper"

describe StaffWithSameSageIdQuery do
  let(:query) { StaffWithSameSageIdQuery.new.all }
  let(:sage_id_1) { "SAGE_ONE" }
  let(:sage_id_2) { "SAGE_TWO" }

  let!(:staff_members_with_duplicated_1) { FactoryGirl.create_list(:staff_member, 10, sage_id: sage_id_1) }
  let!(:staff_members_with_duplicated_2) { FactoryGirl.create_list(:staff_member, 10, sage_id: sage_id_2) }
  let!(:staff_members_without_duplication) { (1..10).map { |number| FactoryGirl.create(:staff_member, sage_id: SecureRandom.hex) } }

  context "Should work" do
    specify "its should return groupped by duplicated sage id staff members" do
      result = query
      expect(result.same_sage_id).to eq(expected_query_result)
    end
  end

  def expected_query_result
    [{
      sageId: sage_id_1,
      staffMembersIds: staff_members_with_duplicated_1.map(&:id),
    }, {
      sageId: sage_id_2,
      staffMembersIds: staff_members_with_duplicated_2.map(&:id),
    }]
  end
end
