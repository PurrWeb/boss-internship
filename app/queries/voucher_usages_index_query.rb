class VoucherUsagesIndexQuery

  def initialize(
    voucher:,
    start_date: nil,
    end_date: nil
  )
    @voucher = voucher
    @start_date = start_date
    @end_date = end_date
  end

  attr_reader :start_date, :end_date, :voucher

  def all
    @all ||= begin
      result = filtered_usages

      result
    end
  end

  def filtered_usages
    result = voucher.voucher_usages.includes(staff_member: [:name, :master_venue])

    if (start_date && end_date).present?
      result = result.where(created_at: [start_date..end_date])
    end

    result
  end
end
