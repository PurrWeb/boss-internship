# Takes a staff member record with assigned attributes (pre save)
# and represents
class StaffMemberUpdatesEmail
  def initialize(user:, old_master_venue:, staff_member:)
    @changed_attributes = []
    @old_values = {}
    @new_values = {}
    @user_name = user.full_name
    @staff_member_id = staff_member.id
    @staff_member_name = staff_member.full_name.titlecase
    @old_master_venue = old_master_venue
    populate_changed_attribute_data(staff_member)
  end
  include ActionView::Helpers::NumberHelper

  attr_reader :staff_member_id, :staff_member_name, :old_master_venue, :user_name

  def data
    {
      user_name: user_name,
      staff_member_id: staff_member_id,
      staff_member_name: staff_member_name,
      changed_attributes: changed_attributes,
      old_values: old_values,
      new_values: new_values
    }
  end

  def send?
    changed_attributes.count > 0
  end

  private
  attr_reader :changed_attributes, :old_values, :new_values

  def populate_changed_attribute_data(staff_member)
    process_master_venue_field(staff_member)
    process_name_field(staff_member)
    process_email_field(staff_member)
    process_address_fields(staff_member)
    process_employment_status_statement(staff_member: staff_member)
    process_field(
      staff_member: staff_member,
      field_name: :staff_type_id,
      value_method: lambda do |value|
        StaffType.find_by(id: value).andand.name
      end
    )
    process_field(
      staff_member: staff_member,
      field_name: :pay_rate_id,
      value_method: lambda do |value|
        PayRate.find_by(id: value).andand.text_description
      end
    )
    process_field(
      staff_member: staff_member,
      field_name: :date_of_birth,
      value_method: lambda do |value|
        value.andand.to_s(:human_date)
      end
    )
    process_field(
      staff_member: staff_member,
      field_name: :starts_at,
      value_method: lambda do |value|
        value.andand.to_s(:human_date)
      end
    )
    process_field(
      staff_member: staff_member,
      field_name: :gender,
      value_method: lambda do |value|
        value.andand.titlecase
      end
    )
    process_field(
      staff_member: staff_member,
      field_name: :sia_badge_expiry_date,
      value_method: lambda do |value|
        value.andand.to_s(:human_date)
      end
    )
    [
      :phone_number,
      :national_insurance_number,
      :sia_badge_number
    ].each do |attribute|
      process_field(
        staff_member: staff_member,
        field_name: attribute,
        value_method: lambda do |value|
          value
        end
      )
    end
  end

  def employment_status_statement_changed?(staff_member)
    staff_member.employment_status_p45_supplied_changed? ||
      staff_member.employment_status_a_changed? ||
      staff_member.employment_status_b_changed? ||
      staff_member.employment_status_c_changed? ||
      staff_member.employment_status_d_changed?
  end

  def process_field(staff_member:, field_name:, value_method:)
    return unless staff_member.public_send("#{field_name}_changed?")
    changed_attributes << field_name

    old_value, new_value = staff_member.changes[field_name]

    old_values[field_name] = value_method.call(old_value) || 'Not Specified'
    new_values[field_name] = value_method.call(new_value) || 'Not Specified'
  end

  def process_address_fields(staff_member)
    return unless staff_member.address_id_changed?

    fields = [:address, :county, :country, :postcode]

    #show all address fields if any have changed
    @changed_attributes = changed_attributes + fields

    old_address = Address.find(staff_member.changes.fetch(:address_id).first)
    current_address = staff_member.address

    fields.each do |address_attribute|
      old_values[address_attribute] = old_address.public_send(address_attribute)
      new_values[address_attribute] = current_address.public_send(address_attribute)
    end
  end

  def process_employment_status_statement(staff_member: staff_member)
    return unless employment_status_statement_changed?(staff_member)

    composite_field_name = :employment_status_statement
    changed_attributes << composite_field_name

    employment_status_statement_fields = ["p45_supplied", "a", "b", "c", "d"].map do |ending|
      "employment_status_#{ending}".to_sym
    end
    old_statement_values = {}
    new_statement_values = {}

    employment_status_statement_fields.each do |field|
      if staff_member.changes[field].present?
        old_statement_values[field] = staff_member.changes[field].first
        new_statement_values[field] = staff_member.changes[field].last
      else
        old_statement_values[field] = staff_member.public_send(field)
        new_statement_values[field] = staff_member.public_send(field)
      end
    end

    new_values[composite_field_name] = employment_statement_message(new_statement_values)
    old_values[composite_field_name] = employment_statement_message(old_statement_values)
  end

  def employment_statement_message(field_values)
    statement_fragments = []
    statement_fragments << EmploymentStatusStatement.text_for_point(:p45_supplied) if field_values.fetch(:employment_status_p45_supplied)
    statement_fragments << EmploymentStatusStatement.text_for_point(:a) if field_values.fetch(:employment_status_a)
    statement_fragments << EmploymentStatusStatement.text_for_point(:b) if field_values.fetch(:employment_status_b)
    statement_fragments << EmploymentStatusStatement.text_for_point(:c) if field_values.fetch(:employment_status_c)
    statement_fragments << EmploymentStatusStatement.text_for_point(:d) if field_values.fetch(:employment_status_d)
    statement_fragments.join("\n\n")
  end

  def process_name_field(staff_member)
    return unless staff_member.name_changed?

    changed_attributes << :name

    name_changes = staff_member.name.changes

    old_first_name = name_changes[:first_name].andand.first || staff_member.name.first_name
    old_surname = name_changes[:surname].andand.first || staff_member.name.surname

    old_name = Name.new(
      first_name: old_first_name,
      surname: old_surname
    )

    old_values[:name] = old_name.full_name.titlecase
    new_values[:name] = staff_member.full_name.titlecase
  end

  def process_email_field(staff_member)
    return unless staff_member.email_address_id_changed?
    changed_attributes << :email_address

    old_email_address_id = staff_member.changes[:email_address_id].first

    old_values[:email_address] = EmailAddress.find(old_email_address_id).email
    new_values[:email_address] = staff_member.email
  end

  def process_master_venue_field(staff_member)
    return unless staff_member.master_venue != old_master_venue

    changed_attributes << :master_venue
    old_values[:master_venue] = old_master_venue.andand.name
    new_values[:master_venue] = staff_member.master_venue.andand.name
  end
end
