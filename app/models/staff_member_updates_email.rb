# Takes a staff member record with assigned attributes (pre save)
# and represents
class StaffMemberUpdatesEmail
  def initialize(old_master_venue:, staff_member:)
    @changed_attribute_data = {}
    @staff_member_id = staff_member.id
    @staff_member_name = staff_member.full_name.titlecase
    @old_master_venue = old_master_venue
    populate_changed_attribute_data(staff_member)
  end
  include ActionView::Helpers::NumberHelper

  attr_reader :staff_member_id, :staff_member_name, :old_master_venue

  def data
    {
      staff_member_id: staff_member_id,
      staff_member_name: staff_member_name,
      changed_attribute_data: changed_attribute_data
    }
  end

  def send?
    changed_attribute_data.count > 0
  end

  private
  attr_reader :changed_attribute_data

  def populate_changed_attribute_data(staff_member)
    if staff_member.master_venue != old_master_venue
      changed_attribute_data[:master_venue] = staff_member.master_venue.name
    end
    if staff_member.name_changed?
      changed_attribute_data[:name] = staff_member.full_name.titlecase
    end
    if staff_member.email_changed?
      changed_attribute_data[:email] = staff_member.email
    end
    if staff_member.staff_type_changed?
      changed_attribute_data[:staff_type] = staff_member.staff_type.name
    end
    if staff_member.pay_rate_changed?
      pay_rate_name = staff_member.pay_rate.name
      pay_rate_amount = number_to_currency(staff_member.pay_rate.pounds_per_hour, unit: '£', precision: 2)
      changed_attribute_data[:pay_rate] = "#{pay_rate_name} #{pay_rate_amount}/h"
    end
    if staff_member.date_of_birth_changed?
      changed_attribute_data[:date_of_birth] = staff_member.date_of_birth.andand.to_s(:human_date) || 'Not Specified'
    end
    if staff_member.starts_at_changed?
      changed_attribute_data[:start_date] = staff_member.starts_at.andand.to_s(:human_date) || 'Not Specified'
    end
    if staff_member.gender_changed?
      changed_attribute_data[:gender] = staff_member.gender.andand.titlecase || 'Not Specified'
    end
    if staff_member.sia_badge_expiry_date_changed?
      changed_attribute_data[:sia_badge_expiry_date] = staff_member.sia_badge_expiry_date.to_s(:human_date) || 'Not Specified'

    end
    if staff_member.phone_number_changed?
      changed_attribute_data[:phone_number] = staff_member.phone_number || 'Not specified'
    end

    [
      :national_insurance_number,
      :sia_badge_number
    ].each do |attribute|
      if staff_member.public_send("#{attribute}_changed?")
        changed_attribute_data[attribute] = staff_member.public_send(attribute) ||'Not Specified'
      end
    end

    if staff_member.address_changed?
      [
        :address_1,
        :address_2,
        :address_3,
        :address_4,
        :region,
        :country,
        :postcode
      ].each do |address_attribute|
        changed_attribute_data[address_attribute] = staff_member.address.public_send(address_attribute)
      end
    end
    if staff_member.employment_status_p45_supplied_changed? ||
      staff_member.employment_status_a_changed? ||
      staff_member.employment_status_b_changed? ||
      staff_member.employment_status_c_changed? ||
      staff_member.employment_status_d_changed?

      employment_status_statement = []
      employment_status_statement << EmploymentStatusStatement.text_for_point(:p45_supplied) if staff_member.employment_status_p45_supplied
      employment_status_statement << EmploymentStatusStatement.text_for_point(:a) if staff_member.employment_status_a
      employment_status_statement << EmploymentStatusStatement.text_for_point(:b) if staff_member.employment_status_b
      employment_status_statement << EmploymentStatusStatement.text_for_point(:c) if staff_member.employment_status_c
      employment_status_statement << EmploymentStatusStatement.text_for_point(:d) if staff_member.employment_status_d
      changed_attribute_data[:employment_status_statement] = employment_status_statement.join("\n\n")
    end
  end
end
