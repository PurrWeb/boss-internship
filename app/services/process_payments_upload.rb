class ProcessPaymentsUpload
  def initialize(requester:, parsed_upload:, nested: false)
    @requester = requester
    @ability = UserAbility.new(requester)
    @parsed_upload = parsed_upload
    @nested = nested
  end
  attr_reader :requester, :ability, :parsed_upload, :nested

  def call
    result_data = {}
    valid_payments = []
    invalid_payments = parsed_upload.fetch(:invalid_payments).clone
    skipped_count = invalid_payments.count
    created_payment_count = 0

    ActiveRecord::Base.transaction(requires_new: nested) do
      parsed_upload.fetch(:valid_payments).each do |payment_parse_data|
        staff_member = payment_parse_data.fetch(:staff_member)
        normalised_payment_data = payment_parse_data.fetch(:normalised_data)
        new_payment_date = normalised_payment_data.fetch(:process_date)
        new_payment_cents = normalised_payment_data.fetch(:net_pay_cents)

        save_successful = false
        payment = Payment.enabled.find_by(
          staff_member: staff_member,
          date: new_payment_date
        )
        if payment.present?
          if payment.cents != new_payment_cents
            save_successful = payment.update_attributes(cents: new_payment_cents)
            payment.mark_pending! if payment.marked_as_received?
          end
        else
          payment = Payment.new(
            date: new_payment_date,
            staff_member: staff_member,
            created_by_user: requester,
            cents: new_payment_cents
          )

          save_successful = payment.save
        end

        if save_successful
          created_payment_count = created_payment_count + 1
          valid_payments << payment_parse_data.merge(
            payment: payment
          )
        else
          skipped_count = skipped_count + 1
          invalid_payments << payment_parse_data.merge({
            errors: { payment: payment.errors.to_h },
            payment: payment
          })
        end
      end
    end

    result_data.merge({
      valid_payments: valid_payments,
      invalid_payments: invalid_payments,
      skipped_count: skipped_count,
      created_count: created_payment_count
    })
  end
end
