class Api::V1::PaymentCsvProcessResultSerializer < ActiveModel::Serializer
  include ActionView::Helpers::NumberHelper

  attributes :resultType, :createdPayments, :updatedPayments, :skippedInvalidPayments, :skippedExistingPayments

  def resultType
    'process'
  end

  def createdPayments
    values = object.fetch(:created_payments)
    values = normalize_payment_data(values)
    values = normalize_staff_member_data(values)
    transform_keys_for_js(values)
  end

  def updatedPayments
    values = object.fetch(:updated_payments)
    values = normalize_payment_data(values)
    values = normalize_staff_member_data(values)
    transform_keys_for_js(values)
  end

  def skippedInvalidPayments
    values = object.fetch(:skipped_invalid_payments)
    values = normalize_payment_data(values)
    values = normalize_staff_member_data(values)
    transform_keys_for_js(values)
  end

  def skippedExistingPayments
    values = object.fetch(:skipped_existing_payments)
    values = normalize_payment_data(values)
    values = normalize_staff_member_data(values)
    transform_keys_for_js(values)
  end

  private
  def normalize_payment_data(values)
    values.map do |value_hash|
      payment = value_hash[:payment]
      if payment.present?
        amount = number_to_currency(payment.cents / 100.0, unit: '£')
        week = RotaWeek.new(payment.date)
        date_range = "#{week.start_date.to_s(:short)} - #{week.end_date.to_s(:short)}"
        value_hash.merge(
          payment: {
            id: payment.id,
            amount: amount,
            dateRange: date_range
          }
        )
      else
        value_hash
      end
    end
  end

  def normalize_staff_member_data(values)
    values.map do |value_hash|
      staff_member = value_hash[:staff_member]
      if staff_member.present?
        staff_type = staff_member.staff_type
        value_hash.merge(
          staff_member: {
            id: staff_member.id,
            name: staff_member.full_name,
            avatarUrl: staff_member.avatar_url,
            staffTypeName: staff_type.name,
            staffTypeBadgeColor: staff_type.ui_color
          }
        )
      else
        value_hash
      end
    end
  end

  def transform_keys_for_js(values)
    values.map do |value_hash|
      value_hash.transform_keys{ |key| key.to_s.camelize(:lower) }
    end
  end
end
