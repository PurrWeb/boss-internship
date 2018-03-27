class Api::V1::PaymentCsvProcessResultSerializer < ActiveModel::Serializer
  attributes :resultType, :createdPayments, :updatedPayments, :skippedInvalidPayments, :skippedExistingPayments

  def resultType
    'process'
  end

  def createdPayments
    values = object.fetch(:created_payments)
    transform_values_for_js(values)
  end

  def updatedPayments
    values = object.fetch(:updated_payments)
    transform_values_for_js(values)
  end

  def skippedInvalidPayments
    values = object.fetch(:skipped_invalid_payments)
    transform_values_for_js(values)
  end

  def skippedExistingPayments
    values = object.fetch(:skipped_existing_payments)
    transform_values_for_js(values)
  end

  private
  def transform_values_for_js(values)
    values.map do |value_hash|
      value_hash.transform_keys{ |key|  key.to_s.camelize(:lower) }
    end
  end
end
