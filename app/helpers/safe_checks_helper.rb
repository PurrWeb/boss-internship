module SafeChecksHelper
  def notes_and_coins(safe_check)
    pounds = SafeCheck::POUND_FIELDS.map do |field|
      value = safe_check.public_send(field)

      if value > 0
        { "#{field}" => number_to_currency(value, unit: '£', precision: 0) }
      else
        { "#{field}" => '-' }
      end
    end

    cents = SafeCheck::CENTS_FIELDS.map do |field|
      value = safe_check.public_send(:pound_value_for, field)

      if value > 0
        { "#{field}" => number_to_currency(value, unit: '£', precision: 2) }
      else
        { "#{field}" => '-' }
      end
    end

    (pounds + cents).reduce({}, :merge)
  end
end
