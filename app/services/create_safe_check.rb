class CreateSafeCheck
  Result = Struct.new(:success, :safe_check, :safe_check_note) do
    def success?
      success
    end
  end

  def initialize(safe_check_params:, safe_check_note_params:, requester:)
    @safe_check_note_params = safe_check_note_params
    @safe_check_params = safe_check_params
    @requester = requester
  end

  def call
    success = false
    safe_check = SafeCheck.new(safe_check_params)
    out_to_order_cents = safe_check.out_to_order_cents
    ash_cash_cents = safe_check.ash_cash_cents
    security_plus_cents = safe_check.security_plus_cents

    calculated_out_to_order_cents = out_to_order_cents - (ash_cash_cents + security_plus_cents)

    safe_check.assign_attributes({out_to_order_cents: calculated_out_to_order_cents})
    safe_check_note = SafeCheckNote.new(
      safe_check_note_params.
        merge(
          safe_check: safe_check,
          created_by: requester,
          note_left_by_note: safe_check.checked_by_note
        )
    )
    safe_check.enabled_notes << safe_check_note if safe_check_note.note_text.present?
    success = safe_check.save

    unless success
      unless (ash_cash_cents + security_plus_cents) <= out_to_order_cents
        safe_check.errors.add(:received_change, "Change received cannot be greater than out to order total")
        safe_check.errors.delete(:out_to_order_cents)
        safe_check.out_to_order_cents = out_to_order_cents
      end
    end

    Result.new(success, safe_check, safe_check_note)
  end

  private
  attr_reader :safe_check_params, :safe_check_note_params, :requester
end
