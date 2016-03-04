# Reads csv with the Following Columns "Employee Reference Employee Name, Address, Email & Mobile  Job Title Employment Status Type  Date of Birth Marital Status  Sex Pay Frequency NI Number NI Cat  Con Out Tax Code  W1/M1 Starter Form  Start Date  Pay Method
require 'byebug'

class ProcessStaffMemberCSV
  def initialize(input_csv:, output_csv:)
    @input_csv = input_csv
    @output_csv = output_csv
  end

  def process
    current_row = nil
    # Used to extract extra fields under the name column
    subrow_count = 0
    output_header_row
    input_csv.each do |line|
      if line.header_row?
      elsif information_line?(line)
        output_current_row(current_row)
        current_row = information_line_data(line)
        subrow_count = 0
      else
        subrow_count += 1
        save_subrow_to(current_row, line, subrow_count)
      end
    end
    output_current_row(current_row)
    nil
  end

  private
  attr_reader :input_csv, :output_csv

  def information_line?(line)
    line.values_at("Employee Reference").first.present?
  end

  def output_header_row
    output_csv << output_headers
  end

  def output_current_row(current_row)
    if current_row.present?
      output_csv << output_headers.map do |header|
        current_row.fetch(header)
      end
    end
  end

  def information_line_data(line)
    values = line.to_hash
    result = {}
    [
      job_title_column_name,
      start_date_column_name,
      ni_number_column_name,
      sex_column_name,
      date_of_birth_column_name
    ].each do |column_name|
      result[column_name] = values.fetch(column_name)
    end
    first_name, last_name = extract_names(values.fetch(name_column_name))
    result["First Name"] = first_name
    result["Last Name"] = last_name
    result["Region"] = "Merseyside"
    result["Country"] = "UK"
    result["Pay Rate"] = 'Age 21-25'
    result
  end

  def save_subrow_to(current_row, line, subrow_count)
    value = line.to_hash[name_column_name]
    case subrow_count
    when 1
      current_row["Address 1"] = value
    when 2
      current_row["Address 2"] = value
    when 3
      current_row["Address 3"] = value
    when 4
      current_row["Address 4"] = value
    when 6
      current_row["Postcode"] = value
    end
  end

  def extract_names(names)
    names_arr = names.split(" ")
    [names_arr[0], names_arr[1..names_arr.length].join(" ")]
  end

  def output_headers
    [
      'First Name',
      'Last Name',
      job_title_column_name,
      start_date_column_name,
      ni_number_column_name,
      sex_column_name,
      date_of_birth_column_name,
      'Address 1',
      'Address 2',
      'Address 3',
      'Address 4',
      'Region',
      'Country',
      'Postcode',
      'Pay Rate'
    ]
  end

  def job_title_column_name
    "Job Title"
  end

  def start_date_column_name
    "Start Date"
  end

  def ni_number_column_name
    "NI Number"
  end

  def sex_column_name
    "Sex"
  end

  def date_of_birth_column_name
    "Date of Birth"
  end

  def name_column_name
    "Employee Name, Address, Email & Mobile"
  end
end
