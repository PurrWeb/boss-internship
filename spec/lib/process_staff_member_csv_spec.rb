require 'rails_helper'
require 'csv'
require_relative '../../lib/process_staff_member_csv'

describe ProcessStaffMemberCSV do
  let(:processor) { ProcessStaffMemberCSV.new(input_csv: input_csv, output_csv: output_csv)}
  let(:input_csv) do
    csv = []
    csv << CSV::Row.new(input_header, input_header, true)
    input_rows.each do |row|
      csv << CSV::Row.new(input_header, row, false)
    end
    csv
  end
  let(:input_header) do
      ["Employee Reference", "Employee Name, Address, Email & Mobile", "Job Title", "Date of Birth", "Sex", "NI Number", "Start Date"]
  end
  let(:input_rows) do
    [
      ["20", "Jacob Farby", "Bar Staff", "05/04/1994", "Male", "JM678965D", "22/05/2014"],
      ["", "The Blue Chapliaincy", "", "" ,"", "", ""],
      ["", "", "", "" ,"", "", ""],
      ["", "Mulberry Pears", "", "", "", "", ""],
      ["", "Liverpool", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "7AD 6YT", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["24", "John Cockren Barnett", "Manager", "04/01/1998", "Female", "JM234987D", "22/10/2022"],
      ["", "A street", "", "" ,"", "", ""],
      ["", "", "", "" ,"", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "Liverpool", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "5L 23B", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""]
    ]
  end
  let(:output_csv) { double('output csv') }
  let(:expected_output) do
    [
      ["First Name", "Last Name", "Job Title", "Start Date", "NI Number", "Sex", "Date of Birth", "Address 1", "Address 2", "Address 3", "Address 4", "Region", "Country", "Postcode", "Pay Rate"],
      ["Jacob", "Farby", "Bar Staff", "22/05/2014", "JM678965D", "Male", "05/04/1994", "The Blue Chapliaincy", "", "Mulberry Pears", "Liverpool", "Merseyside", "UK", "7AD 6YT", "Age 21-25"],
      ["John", "Cockren Barnett", "Manager", "22/10/2022", "JM234987D", "Female", "04/01/1998", "A street", "", "", "Liverpool", "Merseyside", "UK", "5L 23B", "Age 21-25"]
    ]
  end

  specify do
    expected_output.each do |line|
      expect(output_csv).to receive(:<<).with(line).ordered
    end
    processor.process
  end
end
