require 'csv'

class PaymentUploadCSVParser
  PROCCESS_DATE_HEADER = 'DateParameters.ProcessDate'
  VENUE_NAME_HEADER = 'CompanyDetails.Name'
  DEPARTMENT_NAME_HEADER = 'Employees.DepartmentName'
  FIRST_INITIAL_HEADER = 'Employees.Initials'
  SURNAME_HEADER = 'Employees.Surname'
  NI_HEADER = 'Employees.NINumber'
  DOB_HEADER = 'Employees.DateOfBirth'
  NET_PAY_HEADER = 'CurrentPay.RndNetPay'
  HEADERS = [
    PROCCESS_DATE_HEADER,
    VENUE_NAME_HEADER,
    DEPARTMENT_NAME_HEADER,
    FIRST_INITIAL_HEADER,
    SURNAME_HEADER,
    NI_HEADER,
    DOB_HEADER,
    NET_PAY_HEADER
  ]
  UPLOAD_DATE_FORMAT = '%d/%m/%Y'

  DATE_INVALID_PARSE_ERROR_MESSAGE = 'invalid date'
  DATE_FORMAT_INVALID_ERROR_MESSAGE = 'date format invalid'
  MUST_BE_PRESENT_ERROR_MESSAGE = 'must be present'

  def initialize(csv_data:, requester:)
    @csv_data = csv_data
    @requester = requester
  end
  attr_reader :csv_data, :requester

  def parse
    valid_payments = []
    invalid_payments = []
    title_row_errors = {}
    header_row_errors = {}

    row_index = 0
    CSV.parse(csv_data, headers: HEADERS, return_headers: false, skip_blanks: true) do |row|
      if (row_index == 0)
        validate_title_row(row: row, errors: title_row_errors)
        break unless title_row_errors.empty?
      elsif (row_index == 1)
        validate_header_row(row: row, errors: header_row_errors)
        break unless header_row_errors.empty?
      else
        payment_data = processRowData(row)
        if payment_data.fetch(:errors).empty?
          valid_payments << payment_data
        else
          invalid_payments << payment_data
        end
      end
      row_index = row_index + 1
    end

    return {
      title_row_errors: title_row_errors,
      header_row_errors: header_row_errors,
      valid_payments: valid_payments,
      invalid_payments: invalid_payments
    }
  end

  private
  def validate_title_row(row:, errors:)
    title_column = row[0]
    if !(/Title:/.match(title_column).present?)
      errors[:title] ||= []
      errors[:title] << "Is invalid should have format 'Title: <Title>'"
    end

    file_name_column = row[1]
    if !(/FileName:/.match(file_name_column).present?)
      errors[:filename] ||= []
      errors[:filename] << "Is invalid should have format 'FileName: <Filename>'"
    end
  end

  def validate_header_row(row:, errors:)
    HEADERS.each_with_index do |header, index|
      column_value = row[index]
      if column_value != header
        errors[header] = 'Was missing or in unexpected position.'
      end
    end
  end

  def processRowData(row)
    payment_data = {
      raw_data: nil,
      normalised_data: nil,
      staff_member: nil,
      venue: nil,
      errors: {}
    }

    # Collect Data
    ###########
    raw_data = {}

    all_fields_present = true
    raw_data[:process_date_raw] = row[PROCCESS_DATE_HEADER]
    if !raw_data[:process_date_raw].present?
      payment_data.fetch(:errors)[PROCCESS_DATE_HEADER] ||= []
      payment_data.fetch(:errors).fetch(PROCCESS_DATE_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:venue_name_raw] = row[VENUE_NAME_HEADER]
    if !raw_data[:venue_name_raw].present?
      payment_data.fetch(:errors)[VENUE_NAME_HEADER] ||= []
      payment_data.fetch(:errors).fetch(VENUE_NAME_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:department_name_raw] = row[DEPARTMENT_NAME_HEADER]
    if !raw_data[:department_name_raw].present?
      payment_data.fetch(:errors)[DEPARTMENT_NAME_HEADER] ||= []
      payment_data.fetch(:errors).fetch(DEPARTMENT_NAME_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:first_initial_raw]= row[FIRST_INITIAL_HEADER]
    if !raw_data[:first_initial_raw].present?
      payment_data.fetch(:errors)[FIRST_INITIAL_HEADER] ||= []
      payment_data.fetch(:errors).fetch(FIRST_INITIAL_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:surname_raw] = row[SURNAME_HEADER]
    if !raw_data[:surname_raw].present?
      payment_data.fetch(:errors)[SURNAME_HEADER] ||= []
      payment_data.fetch(:errors).fetch(SURNAME_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:ni_number_raw] = row[NI_HEADER]
    if !raw_data[:ni_number_raw].present?
      payment_data.fetch(:errors)[NI_HEADER] ||= []
      payment_data.fetch(:errors).fetch(NI_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:date_of_birth_raw] = row[DOB_HEADER]
    if !raw_data[:date_of_birth_raw].present?
      payment_data.fetch(:errors)[DOB_HEADER] ||= []
      payment_data.fetch(:errors).fetch(DOB_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    raw_data[:net_pay_raw] = row[NET_PAY_HEADER]
    if !raw_data[:net_pay_raw].present?
      payment_data.fetch(:errors)[NET_PAY_HEADER] ||= []
      payment_data.fetch(:errors).fetch(NET_PAY_HEADER) << MUST_BE_PRESENT_ERROR_MESSAGE
      all_fields_present = false
    end

    payment_data[:raw_data] = raw_data
    return payment_data unless all_fields_present

    # Validate Data
    ################
    normalised_data = {}
    all_data_valid = true

    # e.g. 28/01/2018
    normalised_data[:process_date] = nil
    begin
      normalised_data[:process_date] = Date.strptime(
        raw_data.fetch(:process_date_raw).strip,
        UPLOAD_DATE_FORMAT
      )
    rescue ArgumentError => e
      raise unless e.message == DATE_INVALID_PARSE_ERROR_MESSAGE

      payment_data.fetch(:errors)[PROCCESS_DATE_HEADER] ||= []
      payment_data.fetch(:errors).fetch(PROCCESS_DATE_HEADER) << DATE_FORMAT_INVALID_ERROR_MESSAGE
      all_data_valid = false
    end
    normalised_data[:first_initial] = raw_data.fetch(:first_initial_raw).strip
    normalised_data[:surname] = raw_data.fetch(:surname_raw).strip
    normalised_data[:venue_name] = raw_data.fetch(:venue_name_raw).strip
    normalised_data[:department_name] = raw_data.fetch(:department_name_raw).strip
    # eg PW622756A PC644304A
    normalised_data[:ni_number] = nil
    if StaffMember::NATIONAL_INSURANCE_NUMBER_REGEX.match(
        raw_data.fetch(:ni_number_raw).strip
      )
      normalised_data[:ni_number] = raw_data.fetch(:ni_number_raw).strip
    else
      all_data_valid = false
    end
    # e.g. 08/11/1982
    normalised_data[:date_of_birth] = nil
    begin
      normalised_data[:date_of_birth] = Date.strptime(
        raw_data.fetch(:date_of_birth_raw).strip,
        UPLOAD_DATE_FORMAT
      )
    rescue ArgumentError => e
      raise unless e.message == DATE_INVALID_PARSE_ERROR_MESSAGE
      payment_data.fetch(:errors)[DOB_HEADER] ||= []
      payment_data.fetch(:errors).fetch(DOB_HEADER) << DATE_FORMAT_INVALID_ERROR_MESSAGE
      all_data_valid = false
    end
    normalised_data[:net_pay_cents] = (Float(raw_data.fetch(:net_pay_raw).strip) * 100).to_i
    if !normalised_data[:net_pay_cents].present?
      payment_data.fetch(:errors)[NET_PAY_HEADER] ||= []
      payment_data.fetch(:errors).fetch(NET_PAY_HEADER) << "format invalid"
      all_data_valid = false
    end

    payment_data[:normalised_data] = normalised_data
    return payment_data unless all_data_valid

    # Perform Lookups
    ##########
    lookups_successful = true
    venue = Venue.find_by(name: normalised_data.fetch(:venue_name))
    payment_data[:venue] = venue
    if !venue.present?
      lookups_successful = false
      payment_data.fetch(:errors)[VENUE_NAME_HEADER] ||= []
      payment_data.fetch(:errors).fetch(VENUE_NAME_HEADER) << ['does not match venue in system']
    end

    staff_member = StaffMember.find_by(
      national_insurance_number: normalised_data.fetch(:ni_number),
      date_of_birth: normalised_data.fetch(:date_of_birth),
      master_venue: venue
    )
    payment_data[:staff_member] = staff_member
    if !staff_member.present?
      payment_data.fetch(:errors)[:base] ||= []
      payment_data.fetch(:errors).fetch(:base) << 'no matching staff member found'
      lookups_successful = false
    end

    payment_data
  end
end
