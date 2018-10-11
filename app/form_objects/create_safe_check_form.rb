class CreateSafeCheckForm
  def initialize(params:, accessible_venues:)
    @accessible_venues = accessible_venues
    @params = params
  end
  attr_reader :params, :accessible_venues

  def perpare_model(safe_check)
    safe_check.checked_by_note = safe_check_values["checked_by_note"]
    safe_check.received_change = safe_check_values["received_change"]
    safe_check.out_to_order_cents = total_out_to_order_cents
  end

  def total_out_to_order_cents
    parsed_value = nil
    unparsed_value = safe_check_values["out_to_order_cents"]
    begin
      parsed_value = Float(unparsed_value)
    rescue ArgumentError, TypeError
    end

    if parsed_value.present?
      parsed_value * 100.0
    else
      unparsed_value
    end
  end

  def safe_check_params
    {
      checked_by_note: safe_check_values["checked_by_note"],
      venue: venue,
      till_float_cents: venue.till_float_cents,
      safe_float_cents: venue.safe_float_cents,
      out_to_order_cents: total_out_to_order_cents - (cent_params[:ash_cash_cents] + cent_params[:security_plus_cents])
    }.
    merge(cent_params).
    merge(pound_params)
  end

  def safe_check_note_params
    {
      note_text: safe_check_note_values["note_text"]
    }
  end

  def venue
    accessible_venues.find_by(id: safe_check_values["venue_id"])
  end

  private
  def cent_params
    result = {}
    (SafeCheck::CENTS_FIELDS - [:safe_float_cents, :total_float_cents, :till_float_cents, :out_to_order_cents]).each do |field|
      parsed_value = nil
      unparsed_value = safe_check_values.fetch(field.to_s)
      begin
        parsed_value = Float(unparsed_value)
      rescue ArgumentError, TypeError
      end

      if parsed_value.present?
        result[field] = parsed_value * 100.0
      else
        result[field] = unparsed_value
      end
    end
    result
  end

  def pound_params
    result = {}
    SafeCheck::POUND_FIELDS.each do |field|
      parsed_value = nil
      unparsed_value = safe_check_values.fetch(field.to_s)
      begin
        parsed_value = Float(unparsed_value).to_int_if_whole
      rescue ArgumentError, TypeError
      end

      if parsed_value.present?
        result[field] = parsed_value
      else
        result[field] = unparsed_value
      end
    end
    result
  end

  def safe_check_note_values
    safe_check_values["safe_check_note"]
  end

  def safe_check_values
    params["safe_check"]
  end
end
