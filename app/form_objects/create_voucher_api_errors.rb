class CreateVoucherApiErrors
  def initialize(voucher:)
    @voucher = voucher
  end
  attr_reader :voucher

  def errors
    result = {}
    if voucher.errors[:base].present?
      ensure_base_errors_array(result)
      voucher.errors[:base].each do |message|
        result[:base] << message
      end
    end

    if voucher.errors[:venue].present?
      ensure_base_errors_array(result)
      result[:base] << "venue #{voucher.errors[:venue]}"
    end


    if voucher.errors[:enabled].present?
      ensure_base_errors_array(result)
      result[:base] << "enabled #{voucher.errors[:enabled]}"
    end


    result[:description] = voucher.errors[:description] if voucher.errors[:description].present?
    result
  end

  private
  def ensure_base_errors_array(resultErrors)
    resultErrors[:base] = [] unless resultErrors[:base].present?
  end
end
