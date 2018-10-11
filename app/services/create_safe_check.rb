class CreateSafeCheck
  Result = Struct.new(:success, :safe_check, :safe_check_note) do
    def success?
      success
    end
  end

  def initialize(total_out_to_order_cents:, safe_check_params:, safe_check_note_params:, requester:)
    @total_out_to_order_cents = total_out_to_order_cents
    @safe_check_note_params = safe_check_note_params
    @safe_check_params = safe_check_params
    @requester = requester
  end

  def call
    success = false
    safe_check = SafeCheck.new(safe_check_params.merge(creator: requester))
    out_to_order_cents = safe_check.out_to_order_cents
    ash_cash_cents = safe_check.ash_cash_cents
    security_plus_cents = safe_check.security_plus_cents

    safe_check_note = SafeCheckNote.new(
      safe_check_note_params.
        merge(
          safe_check: safe_check,
          created_by: requester,
          note_left_by_note: safe_check.checked_by_note
        )
    )

    out_to_order_extras_more_than_total = (ash_cash_cents + security_plus_cents)  > total_out_to_order_cents
    out_to_order_fields_values_invalid = total_out_to_order_cents != (out_to_order_cents + ash_cash_cents + security_plus_cents)
    if out_to_order_extras_more_than_total || out_to_order_fields_values_invalid
      safe_check.errors.add(:received_change, "Change received cannot be greater than out to order total")
    else
      success = true
    end

    if success
      ActiveRecord::Base.transaction do
        safe_check.enabled_notes << safe_check_note if safe_check_note.note_text.present?
        success = safe_check.save
        raise ActiveRecord::Rollback unless success
      end
    end

    Result.new(success, safe_check, safe_check_note)
  end

  private
  attr_reader :safe_check_params, :safe_check_note_params, :requester, :total_out_to_order_cents
end
