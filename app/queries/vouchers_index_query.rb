class VouchersIndexQuery

  def initialize(
    venue:,
    start_date: nil,
    end_date: nil,
    status:
  )
    @venue = venue
    @start_date = start_date
    @end_date = end_date
    @status = status
  end
  
  attr_reader :venue, :start_date, :end_date, :status

  def all
    @all ||= begin
      result = filtered_vouchers
      
      result
    end
  end
  
  def filtered_vouchers
    unless ["active", "all"].include? status
      raise "Vouchers filter error"
    end

    result = case status
      when "active"
        venue.vouchers.enabled
      when "all"
        venue.vouchers
    end

    if (start_date && end_date).present?
      result = result.where(created_at: [start_date..end_date])
    end

    result
  end
end
