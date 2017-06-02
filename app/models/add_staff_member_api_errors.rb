class AddStaffMemberApiErrors
  def initialize(staff_member:)
    @staff_member = staff_member
  end
  attr_reader :staff_member

  def errors
    staff_member_errors =  staff_member.errors.messages
    result = {}
    direct_fields.each do |field|
      error_value = staff_member_errors.delete(field)
      result[field] = error_value if error_value.present?
    end
    nested_fields.each do |parent_field, fields|
      fields.each do |field_data|
        error_value = staff_member_errors.delete(
          nested_field_key(
            parent_field: parent_field,
            field: field_data.fetch(:source)
          )
        )
        result[field_data.fetch(:dest)] = error_value if error_value.present?
      end
    end

    unused_keys = staff_member_errors.keys
    raise "Unused keys: #{unused_keys} found after mapping" if unused_keys.present?

    result
  end

  private
  def name_fields
    ["first_name", "surname"]
  end

  def nested_field_key(parent_field:, field:)
    "#{parent_field}.#{field}".to_sym
  end

  def direct_fields
    [
      :base,
      :pin_code,
      :gender,
      :phone_number,
      :date_of_birth,
      :starts_at,
      :national_insurance_number,
      :hours_preference_note,
      :day_perference_note,
      :employment_status_a,
      :employment_status_b,
      :employment_status_c,
      :employment_status_d,
      :employment_status_p45_supplied,
      :staff_type,
      :sia_badge_number,
      :sia_badge_expiry_date,
      :avatar_base64,
      :pay_rate,
      :master_venue,
      :work_venues,
      :email_address
    ]
  end

  def nested_fields
    {
      name: [
        { source: :first_name, dest: :first_name },
        { source: :last_name, dest: :last_name }
      ],
      email_address: [
        { source: :email, dest: :email_address }
      ],
      address: [
        { source: :address, dest: :address },
        { source: :postcode, dest: :postcode },
        { source: :country, dest: :country },
        { source: :county, dest: :county }
      ]
    }
  end
end
