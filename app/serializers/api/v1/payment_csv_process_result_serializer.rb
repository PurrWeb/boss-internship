class Api::V1::PaymentCsvProcessResultSerializer < ActiveModel::Serializer
  attributes :validPayments, :invalidPayments, :skippedCount, :createdCount, :resultType

  def resultType
    'process'
  end

  def validPayments
    object.fetch(:valid_payments)
  end

  def invalidPayments
    object.fetch(:invalid_payments)
  end

  def skippedCount
    object.fetch(:skipped_count)
  end

  def createdCount
    object.fetch(:created_count)
  end
end
