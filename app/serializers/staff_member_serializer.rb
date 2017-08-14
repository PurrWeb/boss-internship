class StaffMemberSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id,
             :url,
             :avatar_url,
             :first_name,
             :surname,
             :email,
             :phone_number,
             :master_venue,
             :other_venues,
             :staff_type,
             :start_date,
             :pay_rate,
             :hours_preference,
             :day_preference,
             :national_insurance_number,
             :disabled,
             :disabled_at,
             :disable_reason,
             :disabled_by_user,
             :gender,
             :date_of_birth,
             :address,
             :country,
             :postcode,
             :county,
             :status_statement
             

  def url
    api_v1_staff_member_url(object)
  end
  
  def status_statement
    [:employment_status_a,
     :employment_status_b,
     :employment_status_c,
     :employment_status_d,
     :employment_status_p45_supplied].find do |statement|
      object.send(statement) == true
    end
  end

  def address
    object.address && object.address.address
  end

  def postcode
    object.address && object.address.postcode
  end

  def country
    object.address && object.address.country
  end

  def county
    object.address && object.address.county
  end

  def disabled_by_user
    if object.disabled_by_user.present?
      object.disabled_by_user.full_name.titlecase
    end
  end
  
  def disabled
    object.disabled?
  end

  def day_preference
    object.day_perference_note
  end

  def hours_preference
    object.hours_preference_note
  end

  def pay_rate
    { value: object.pay_rate.id, label: object.pay_rate.name } if object.pay_rate.present?
  end

  def start_date
    object.starts_at
  end

  def staff_type
    {value: object.staff_type.id, label: object.staff_type.name} if object.staff_type.present?
  end

  def master_venue
    {value: object.master_venue.id, label: object.master_venue.name} if object.master_venue.present?
  end

  def first_name
    object.name && object.name.first_name
  end

  def surname
    object.name && object.name.surname
  end

  def other_venues
    object.work_venues.map do |venue|
      {value: venue.id, label: venue.name}
    end
  end

end
