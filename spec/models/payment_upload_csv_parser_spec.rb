require 'rails_helper'

describe PaymentUploadCSVParser do
  let(:venue) { FactoryGirl.create(:venue, name: 'blue') }
  let(:valid_title_row) { ['Title: Departmental Analysis Gross To Net Portrait', "FileName: EDIT 1.REPORT", nil, nil, nil, nil, nil, nil] }
  let(:valid_header_row) { ['DateParameters.ProcessDate','CompanyDetails.Name','Employees.DepartmentName','Employees.Initials','Employees.Surname','Employees.NINumber','Employees.DateOfBirth','CurrentPay.RndNetPay'] }
  let(:process_date) { Date.new(2018, 2, 20)}
  let(:department_name) { 'Manager' }
  let(:venue_name) { venue.name }
  let(:ni_number ) { 'JS031127D' }
  let(:first_initial) { 'P' }
  let(:surname) { 'Coulter' }
  let(:date_of_birth) { Time.current.to_date - 18.years }
  let(:net_pay_cents) { 35069 }
  let(:net_pay) { (Float(net_pay_cents) / 100.0).to_s }
  let(:raw_process_date) do
    process_date.strftime(PaymentUploadCSVParser::UPLOAD_DATE_FORMAT)
  end
  let(:raw_department_name) { department_name + '   ' }
  let(:raw_venue_name) { venue_name + '    ' }
  let(:raw_ni_number ) { '    ' + ni_number }
  let(:raw_first_initial) { first_initial + '    '}
  let(:raw_surname) { surname + '   ' }
  let(:raw_net_pay) { net_pay + '  ' }
  let(:raw_date_of_birth) do
    date_of_birth.strftime(PaymentUploadCSVParser::UPLOAD_DATE_FORMAT) + '   '
  end
  let(:valid_payment_row) do
    [
      raw_process_date,
      raw_venue_name,
      raw_department_name,
      raw_first_initial,
      raw_surname,
      raw_ni_number,
      raw_date_of_birth,
      raw_net_pay
    ]
  end
  let(:requester) { FactoryGirl.create(:user) }
  let(:csv_data) do
    CSV.generate do |csv|
      row_data.each do |rowDatum|
        csv << rowDatum
      end
    end
  end
  let(:parser) { PaymentUploadCSVParser.new(csv_data: csv_data, requester: requester) }

  context 'Matching staff Member exists' do
    let(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        national_insurance_number: raw_ni_number,
        date_of_birth: date_of_birth,
        master_venue: venue
      )
    end

    before do
      staff_member
    end

    context 'valid data is supplied ' do
      let(:row_data) do
        [valid_title_row, valid_header_row, valid_payment_row]
      end

      it 'should create a valid payment' do
        result = parser.parse
        expect(result.fetch(:invalid_payments).count).to eq(0)
        expect(result.fetch(:valid_payments).count).to eq(1)
      end

      describe 'valid_payment' do
        it 'should contain raw data' do
          valid_payment = parser.parse.fetch(:valid_payments).first
          raw_data = valid_payment.fetch(:raw_data)

          expect(raw_data.fetch(:process_date_raw)).to eq(raw_process_date)
          expect(raw_data.fetch(:venue_name_raw)).to eq(raw_venue_name)
          expect(raw_data.fetch(:department_name_raw)).to eq(raw_department_name)
          expect(raw_data.fetch(:first_initial_raw)).to eq(raw_first_initial)
          expect(raw_data.fetch(:surname_raw)).to eq(raw_surname)
          expect(raw_data.fetch(:ni_number_raw)).to eq(raw_ni_number)
          expect(raw_data.fetch(:date_of_birth_raw)).to eq(raw_date_of_birth)
          expect(raw_data.fetch(:net_pay_raw)).to eq(raw_net_pay)
        end

        it 'should contain normalised data' do
          valid_payment = parser.parse.fetch(:valid_payments).first
          normalised_data = valid_payment.fetch(:normalised_data)

          expect(normalised_data.fetch(:process_date)).to eq(process_date)
          expect(normalised_data.fetch(:venue_name)).to eq(venue_name)
          expect(normalised_data.fetch(:department_name)).to eq(department_name)
          expect(normalised_data.fetch(:first_initial)).to eq(first_initial)
          expect(normalised_data.fetch(:surname)).to eq(surname)
          expect(normalised_data.fetch(:ni_number)).to eq(ni_number)
          expect(normalised_data.fetch(:date_of_birth)).to eq(date_of_birth)
          expect(normalised_data.fetch(:net_pay_cents)).to eq(net_pay_cents)
        end

        it 'should contain venue' do
          valid_payment = parser.parse.fetch(:valid_payments).first
          returned_venue = valid_payment.fetch(:venue)
          expect(returned_venue).to eq(venue)
        end

        it 'should contain staff_member' do
          valid_payment = parser.parse.fetch(:valid_payments).first
          returned_staff_member = valid_payment.fetch(:staff_member)
          expect(returned_staff_member).to eq(staff_member)
        end

        it 'should have no errors' do
          valid_payment = parser.parse.fetch(:valid_payments).first
          expect(valid_payment.fetch(:errors)).to eq({})
        end
      end

      describe 'title row is invalid' do
        let(:row_data) do
          [ invalid_title_row, valid_header_row, valid_payment_row ]
        end

        context 'title row has invalid Title field' do
          let(:invalid_title_row) { ['Tite: Departmental Analysis Gross To Net Portrait', "FileName: EDIT 1.REPORT", nil, nil, nil, nil, nil, nil] }
          it 'should not process any payments' do
            result = parser.parse
            expect(result.fetch(:invalid_payments).count).to eq(0)
            expect(result.fetch(:valid_payments).count).to eq(0)
          end

          it 'should return header error' do
            title_row_errors = parser.parse.fetch(:title_row_errors)
            expect(title_row_errors).to eq(
              title: ["Is invalid should have format 'Title: <Title>'"]
            )
          end
        end

        context 'title row has invalid Filename field' do
          let(:invalid_title_row) { ['Title: Departmental Analysis Gross To Net Portrait', "Fileame: EDIT 1.REPORT", nil, nil, nil, nil, nil, nil] }
          it 'should not process any payments' do
            result = parser.parse
            expect(result.fetch(:invalid_payments).count).to eq(0)
            expect(result.fetch(:valid_payments).count).to eq(0)
          end

          it 'should return error' do
            title_row_errors = parser.parse.fetch(:title_row_errors)
            expect(title_row_errors).to eq({
              filename: ["Is invalid should have format 'FileName: <Filename>'"]
            })
          end
        end
      end

      describe 'header row is invalid' do
        let(:row_data) do
          [ valid_title_row, invalid_header_row, valid_payment_row ]
        end

        PaymentUploadCSVParser::HEADERS.each do |header|
          context "header row has invalid #{header} header" do
            let(:invalid_header_row) do
              row = PaymentUploadCSVParser::HEADERS.clone
              row[row.index(header)] = nil
              row
            end

            it 'should return error for the header' do
              result = parser.parse
              expect(
                result.fetch(:header_row_errors)
              ).to eq({
                header => "Was missing or in unexpected position."
              })
            end
          end
        end
      end
    end
  end
end
