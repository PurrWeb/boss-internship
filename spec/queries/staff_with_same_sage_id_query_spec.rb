require "rails_helper"

describe StaffWithSameSageIdQuery do
  let(:query) { StaffWithSameSageIdQuery.new.all }
  let(:sage_id_1) { "SAGE_ONE" }
  let(:sage_id_2) { "SAGE_TWO" }
  let(:master_venue) { FactoryGirl.create(:venue) }
  let!(:staff_members_with_duplicated_1) { FactoryGirl.create_list(:staff_member, 10, master_venue: master_venue, sage_id: sage_id_1) }
  let!(:staff_members_with_duplicated_2) { FactoryGirl.create_list(:staff_member, 10, master_venue: master_venue, sage_id: sage_id_2) }
  let!(:staff_members_without_duplication) { (1..10).map { |number| FactoryGirl.create(:staff_member, sage_id: SecureRandom.hex) } }

  context "Query" do
    specify "should return staff members with duplicated sage id" do
      staff_members = query
      expect(staff_members).to eq(expected_query_result)
    end
  end

  def expected_query_result
    staff_members_with_duplicated_1.concat(staff_members_with_duplicated_2)
  end
end
