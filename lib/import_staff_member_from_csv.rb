class ImportStaffMemberFromCSV
  def initialize(requester:, input_csv:, avatar_path:, logger: Rails.logger)
    @requester = requester
    @input_csv = input_csv
    @avatar_path = avatar_path
    @logger = logger
  end

  def call
    ActiveRecord::Base.transaction do
      processed = 0
      input_csv.each do |line|
        next if line.header_row?
        processed += 1
        logger.info "processing record: #{processed}"

        values = line.to_hash

        name = Name.new(
          first_name: values.fetch(first_name_column),
          surname: values.fetch(surname_column)
        )

        address_parts = [
          values.fetch(address_1_column),
          values.fetch(address_2_column),
          values.fetch(address_3_column),
          values.fetch(address_4_column)
        ].compact

        address = Address.new(
          address: address_parts.join("\n"),
          county: values.fetch(region_column),
          country: values.fetch(country_column),
          postcode: values.fetch(postcode_column)
        )

        staff_type_name = normalise_staff_type_name(values.fetch(staff_type_column))
        begin
          staff_type = StaffType.find_by!(name: staff_type_name)
        rescue ActiveRecord::RecordNotFound
          raise ActiveRecord::RecordNotFound, "Couldn't find StaffType with name: #{staff_type_name}"
        end

        venue_name = values.fetch(venue_column)
        venue = Venue.find_by!(name: venue_name)

        pay_rate_name = values.fetch(pay_rate_column)
        pay_rate = PayRate.find_by!(name: pay_rate_name)

        staff_member = StaffMember.new(
          creator: requester,
          name: name,
          address: address,
          staff_type: staff_type,
          gender: normalise_gender(values.fetch(gender_column)),
          pin_code: generate_random_pin,
          starts_at: Date.strptime(values.fetch(starts_at_column), date_format),
          date_of_birth: Date.strptime(values.fetch(date_of_birth_column), date_format),
          national_insurance_number: values.fetch(national_insurance_number_column),
          pay_rate: pay_rate,
          employment_status_a: false,
          employment_status_b: false,
          employment_status_c: false,
          employment_status_d: false,
          employment_status_p45_supplied: false
        )
        attach_avatar_image(staff_member)

        staff_member.master_venue = venue
        staff_member.save!
      end
    end
  end

  private
  attr_reader :requester, :input_csv, :avatar_path, :logger

  def attach_avatar_image(staff_member)
    File.open(avatar_path) do |f|
      staff_member.avatar = f
    end
  end

  def generate_random_pin
    Array.new(5) do
      rand(10)
    end.join('')
  end

  def date_format
    '%d/%m/%Y'
  end

  def normalise_gender(gender)
    gender.downcase
  end

  def normalise_staff_type_name(staff_type_name)
    case staff_type_name.titlecase.strip
    when 'Bar Staff'
      'Bartender'
    when 'Kitchen Porter'
      'KP'
    when 'Kitchen Staff'
      'KP'
    else
      staff_type_name.titlecase.strip
    end
  end

  def columns
    [
      first_name_column,
      surname_column,
      gender_column,
      staff_type_column,
      national_insurance_number_column,
      starts_at_column,
      date_of_birth_column,
      address_1_column,
      address_2_column,
      address_3_column,
      address_4_column,
      region_column,
      country_column,
      postcode_column,
      pay_rate_column
    ]
  end

  def first_name_column
    'First Name'
  end

  def surname_column
    'Last Name'
  end

  def gender_column
    'Sex'
  end

  def staff_type_column
    'Job Title'
  end

  def national_insurance_number_column
    'NI Number'
  end

  def starts_at_column
    'Start Date'
  end

  def date_of_birth_column
    'Date of Birth'
  end

  def address_1_column
    'Address 1'
  end

  def address_2_column
    'Address 2'
  end

  def address_3_column
    'Address 3'
  end

  def address_4_column
    'Address 4'
  end

  def region_column
    'Region'
  end

  def country_column
    'Country'
  end

  def postcode_column
    'Postcode'
  end

  def pay_rate_column
    'Pay Rate'
  end

  def venue_column
    'Venue'
  end
end
