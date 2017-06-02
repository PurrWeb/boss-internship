class AddStaffMemberApiCallParams
  def initialize(params_json:, requester:)
    @params_json = params_json
    @requester = requester
  end
  attr_reader :requester, :params_json

  def required_params
    [
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
      :first_name,
      :surname,
      :staff_type,
      :address,
      :postcode,
      :country,
      :county,
      :sia_badge_number,
      :sia_badge_expiry_date,
      :avatar_base64,
      :pay_rate_id,
      :master_venue_id,
      :work_venue_ids,
      :email_address
    ]
  end

  def model_params
    result = {
      pin_code: params_json.fetch("pin_code"),
      gender: params_json.fetch("gender"),
      phone_number: params_json.fetch("phone_number"),
      date_of_birth: params_json.fetch("date_of_birth"),
      starts_at: params_json.fetch("starts_at"),
      national_insurance_number: params_json.fetch("national_insurance_number"),
      hours_preference_note: params_json.fetch("hours_preference_note"),
      day_perference_note: params_json.fetch("day_preference_note"),
      employment_status_a: params_json.fetch("employment_status_a"),
      employment_status_b: params_json.fetch("employment_status_b"),
      employment_status_c: params_json.fetch("employment_status_c"),
      employment_status_d: params_json.fetch("employment_status_d"),
      employment_status_p45_supplied: params_json.fetch("employment_status_p45_supplied"),
      name_attributes: {
        first_name: params_json.fetch("first_name"),
        surname: params_json.fetch("surname"),
      },
      staff_type: StaffType.find_by(params_json.fetch("staff_type_id")),
      address_attributes: {
        address: params_json.fetch("address"),
        postcode: params_json.fetch("postcode"),
        county: params_json.fetch("county"),
        country: params_json.fetch("country")
      },
      sia_badge_number: params_json.fetch("sia_badge_number"),
      sia_badge_expiry_date: params_json.fetch("sia_badge_expiry_date"),
      pay_rate: PayRate.find_by(id: params_json.fetch("pay_rate_id")),
      master_venue: Venue.find_by(id: params_json.fetch("master_venue_id")),
      work_venues: params_json.fetch("work_venue_ids").map{ |id| Venue.find(id) },
      email_address_attributes: {
        email: params_json.fetch("email_address")
      }
    }
    avatar_data_uri = params_json.fetch("avatar_base64")
    if avatar_data_uri.present?
      result[:avatar_data_uri] = avatar_data_uri
    end

    result
  end
end
