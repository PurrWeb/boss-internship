class ProcessPaymentsUpload
  def initialize(requester:, parsed_upload:, nested: false)
    @requester = requester
    @ability = UserAbility.new(requester)
    @parsed_upload = parsed_upload
    @nested = nested
  end
  attr_reader :requester, :ability, :parsed_upload, :nested

  def call
    created_payments = []
    updated_payments = []
    skipped_invalid_payments = parsed_upload.fetch(:invalid_payments).clone
    skipped_existing_payments = []

    ActiveRecord::Base.transaction(requires_new: nested) do
      parsed_upload.fetch(:valid_payments).each do |payment_parse_data|
        staff_member = payment_parse_data.fetch(:staff_member)
        normalised_payment_data = payment_parse_data.fetch(:normalised_data)
        new_payment_date = normalised_payment_data.fetch(ParsePaymentUploadCSV::PROCCESS_DATE_HEADER)
        new_payment_cents = normalised_payment_data.fetch(ParsePaymentUploadCSV::NET_PAY_HEADER)

        payment = Payment.enabled.find_by(
          staff_member: staff_member,
          date: new_payment_date
        )
        if payment.present?
          payment_updateable = payment.cents != new_payment_cents

          if payment_updateable
            update_successful = payment.update_attributes(cents: new_payment_cents)
            payment.mark_pending! if payment.marked_as_received?

            if update_successful
              updated_payments << payment_parse_data.merge({
                payment: payment
              })
            else
              skipped_invalid_payments << payment_parse_data.merge({
                errors: { payment: payment.errors.to_h },
                payment: payment
              })
            end
          else
            skipped_existing_payments << payment_parse_data.merge({
             payment: payment
            })
          end
        else
          payment = Payment.new(
            date: new_payment_date,
            staff_member: staff_member,
            created_by_user: requester,
            cents: new_payment_cents
          )

          if payment.save
            created_payments << payment_parse_data.merge(
              payment: payment
            )
          else
            skipped_invalid_payments << payment_parse_data.merge({
              errors: { payment: payment.errors.to_h },
              payment: payment
            })
          end
        end
      end
    end

    {
      created_payments: created_payments,
      updated_payments: updated_payments,
      skipped_invalid_payments: skipped_invalid_payments,
      skipped_existing_payments: skipped_existing_payments,
    }
  end
end
