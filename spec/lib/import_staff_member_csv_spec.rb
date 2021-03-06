require 'rails_helper'
require 'csv'
require_relative '../../lib/import_staff_member_from_csv'

describe ImportStaffMemberFromCSV do
  let(:requester) { FactoryGirl.create(:user, :admin) }
  let(:importer) do
    ImportStaffMemberFromCSV.new(
      requester: requester,
      input_csv: input_csv,
      avatar_path: TestImageHelper.arnie_face_path
    )
  end
  let(:input_csv) do
    csv = []
    csv << CSV::Row.new(input_header, input_header, true)
    input_rows.each do |row|
      csv << CSV::Row.new(input_header, row, false)
    end
    csv
  end
  let(:input_header) do
      ["First Name", "Last Name", "Venue", "Job Title", "Start Date", "NI Number", "Sex", "Date of Birth", "Address 1", "Address 2", "Address 3", "Address 4", "Region", "Country", "Postcode", "Pay Rate"]
  end
  let(:input_rows) do
    [user_1_row, user_2_row]
  end
  let(:user_1_row) do
    ["Lover", "Greg", "McCooleys","Bar Staff", "19/03/2014", "JM034753D", "Male", "01/09/1992",  "The Blue Chapliaincy",  "Yellow Street", "Liverpool", "", "Merseyside", "UK", "L8 7EG", "Pay Rate 1"]
  end
  let(:user_2_row) do
    ["Sam", "Reed", "Ryans Bar", "Manager", "20/10/2014", "JM033743D", "Female", "20/09/1992",  "30 John Road", "Southlands", "Liverpool", "", "Merseyside", "UK", "L8 7EG", "Pay Rate 1"]
  end

  before do
    # Seed data
    FactoryGirl.create(:staff_type, name: 'Bartender')
    FactoryGirl.create(:staff_type, name: 'Manager')
    FactoryGirl.create(:pay_rate, name: 'Pay Rate 1')
    FactoryGirl.create(:venue, name: 'McCooleys')
    FactoryGirl.create(:venue, name: 'Ryans Bar')
  end

  context 'before call' do
    specify 'no staff members exist' do
      expect(StaffMember.count).to eq(0)
    end
  end

  context 'after call' do
    before do
      importer.call
    end

    specify 'it should import the users' do
      expect(StaffMember.count).to eq(2)
    end
  end
end
