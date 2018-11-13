require "rails_helper"

describe AddHolidayStaffMembersQuery, :holiday do
  context 'searching by name only' do
    let(:query) do
      AddHolidayStaffMembersQuery.new(
        requester: requester,
      )
    end
    let(:venue) { FactoryGirl.create(:venue) }
    let(:requester) { FactoryGirl.create(:user, :manager, venues: [venue]) }
    let(:staff_member_name) do
      Name.create!(
        first_name: "Johnny",
        surname: "Joneser",
      )
    end
    let(:enabled_staff_member) do
      FactoryGirl.create(
        :staff_member,
        name: staff_member_name,
        master_venue: venue,
      )
    end
    let(:disabled_staff_member) do
      FactoryGirl.create(
        :staff_member,
        :disabled,
        name: staff_member_name,
        master_venue: venue,
      )
    end

    before do
      staff_member
    end

    context "before call" do
      let(:staff_member) { enabled_staff_member }

      specify "staff members should exist" do
        expect(StaffMember.count).to eq(1)
      end
    end

    context 'after call' do
      let(:result) { query.all(query: query_string) }

      context 'staff_member is enabled' do
        let(:staff_member) { enabled_staff_member }

        context 'query is wrong name' do
          let(:query_string) { 'foo' }

          it 'should not match staff_member' do
            expect(result.count).to eq(0)
          end
        end

        context 'query full name exact match' do
          let(:query_string) { staff_member.full_name }

          it 'should match staff_member' do
            expect(result.count).to eq(1)
            expect(result[0].id).to eq(staff_member.id)
          end
        end

        context 'query is first name only' do
          let(:query_string) { staff_member.first_name }

          it 'should match staff_member' do
            expect(result.count).to eq(1)
            expect(result[0].id).to eq(staff_member.id)
          end
        end

        context 'query is surname only' do
          let(:query_string) { staff_member.surname }

          it 'should match staff_member' do
            expect(result.count).to eq(1)
            expect(result[0].id).to eq(staff_member.id)
          end
        end

        context 'query is full name with different case' do
          let(:query_string) { staff_member.full_name.downcase }

          it 'should match staff member' do
            expect(result.count).to eq(1)
            expect(result[0].id).to eq(staff_member.id)
          end
        end
      end

      context 'staff member is disabled' do
        let(:staff_member) { disabled_staff_member }

        context 'query full name exact match' do
          let(:query_string) { staff_member.full_name }

          it 'should not match staff_member' do
            expect(result.count).to eq(0)
          end
        end
      end
    end
  end

  context 'filtering by venue also' do
    let(:venue) { FactoryGirl.create(:venue) }
    let(:other_venue) { FactoryGirl.create(:venue) }
    let(:requester) { FactoryGirl.create(:user, :manager, venues: [venue]) }
    let(:staff_member_name) do
      Name.create!(
        first_name: "Johnny",
        surname: "Joneser",
      )
    end
    let(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        name: staff_member_name,
        master_venue: venue,
      )
    end
    let(:query) do
      AddHolidayStaffMembersQuery.new(
        requester: requester
      )
    end
    let(:result) do
      query.all(
        query: staff_member_name.full_name,
        venue: request_venue,
      )
    end

    before do
      venue
      other_venue
      staff_member
    end

    context "before call" do
      specify "staff members should exist" do
        expect(StaffMember.count).to eq(1)
      end
    end

    context "after call" do
      context 'venue matches' do
        let(:request_venue) { venue }

        it 'should match staff member' do
          expect(result.count).to eq(1)
          expect(result[0].id).to eq(staff_member.id)
        end
      end

      context "venue doesn't match" do
        let(:request_venue) { other_venue }

        it 'should not match staff member' do
          expect(result.count).to eq(0)
        end
      end
    end
  end
end
