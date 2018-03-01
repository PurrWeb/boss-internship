require 'rails_helper'
require_relative '../support/test_data_helper'

describe PaymentUploadCSVParser do
  let(:valid_title_row) { ['Title: Departmental Analysis Gross To Net Portrait', "FileName: EDIT 1.REPORT", nil, nil, nil, nil, nil, nil] }
  let(:valid_header_row) { ['DateParameters.ProcessDate','CompanyDetails.Name','Employees.DepartmentName','Employees.Initials','Employees.Surname','Employees.NINumber','Employees.DateOfBirth','CurrentPay.RndNetPay'] }
  let(:valid_payment_row) { ['28/01/2018','soho','Manager','P','Coulter','JS031127D','04/04/1992','350.69'] }

  it 'should parse' do
    rowData = [
      valid_title_row,
      valid_header_row,
      valid_payment_row
    ]

    csvData = CSV.generate do |csv|
      rowData.each do |rowDatum|
        csv << rowDatum
      end
    end

    parser = PaymentUploadCSVParser.new(csvData)

    result = parser.parse
    expect(result.fetch(:invalid_payments).count).to eq(0)
    expect(result.fetch(:valid_payments).count).to eq(1)
  end
end
