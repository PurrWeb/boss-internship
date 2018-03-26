class Api::V1::PaymentCsvProcessResultSerializer < ActiveModel::Serializer
  attributes :resultType, :createdPayments, :createdCount, :updatedPayments, :updatedCount, :skippedInvalidPayments, :skippedInvalidCount, :skippedExistingPayments, :skippedExistingCount

  def resultType
    'process'
  end

  def createdPayments
    object.fetch(:created_payments)
  end

  def createdCount
    object.fetch(:created_count)
  end

  def updatedPayments
    object.fetch(:updated_payments)
  end

  def updatedCount
    object.fetch(:updated_count)
  end

  def skippedInvalidPayments
    object.fetch(:skipped_invalid_payments)
  end

  def skippedInvalidCount
    object.fetch(:skipped_invalid_count)
  end

  def skippedExistingPayments
    object.fetch(:skipped_existing_payments)
  end

  def skippedExistingCount
    object.fetch(:skipped_existing_count)
  end
end
