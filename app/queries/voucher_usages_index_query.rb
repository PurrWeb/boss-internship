class VoucherUsagesIndexQuery

  def initialize(
    voucher:,
    start_date: nil,
    end_date: nil,
    status:
  )
    @voucher = voucher
    @start_date = start_date
    @end_date = end_date
    @status = status
  end
  
  attr_reader :start_date, :end_date, :status, :voucher

  def all
    @all ||= begin
      result = filtered_usages
      
      result
    end
  end
  
  def filtered_usages
    unless ["active", "all"].include? status
      raise "Usages filter error"
    end

    result = case status
      when "active"
        voucher.voucher_usages.includes(staff_member: [:name, :master_venue])
      when "all"
        voucher.voucher_usages.includes(staff_member: [:name, :master_venue])
    end

    if (start_date && end_date).present?
      result = result.where(created_at: [start_date..end_date])
    end

    result
  end
end
