class Api::V1::PaymentCsvProcessResultSerializer < ActiveModel::Serializer
  attributes :resultType, :createdPayments, :updatedPayments, :skippedInvalidPayments, :skippedExistingPayments

  def resultType
    'process'
  end

  def createdPayments
    object.fetch(:created_payments)
  end

  def updatedPayments
    object.fetch(:updated_payments)
  end

  def skippedInvalidPayments
    object.fetch(:skipped_invalid_payments)
  end

  def skippedExistingPayments
    object.fetch(:skipped_existing_payments)
  end
end
