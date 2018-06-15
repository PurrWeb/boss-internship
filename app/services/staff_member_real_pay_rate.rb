class StaffMemberRealPayRate
  def initialize(now: Time.now, staff_member:)
    @now = now
    @staff_member = staff_member
  end

  def call
    case staff_member_pay_rate_name
    when *PayRate::PAY_RATE_GROUPS[:normal]
      new_payrate_data(new_pay_rate_name: pay_rate_from_normal_group)
    when *PayRate::PAY_RATE_GROUPS[:bar_supervisor]
      new_payrate_data(new_pay_rate_name: pay_rate_from_bar_supervisor_group)
    when *PayRate::PAY_RATE_GROUPS[:bolton]
      new_payrate_data(new_pay_rate_name: pay_rate_from_bolton_group)
    else
      raise_wrond_pay_rate_exception
    end
  end

  private
  def pay_rate_from_normal_group
    case staff_member_age
    when 18..20
      PayRate::NORMAL_18_20_PAY_RATE
    when 21..24
      PayRate::NORMAL_21_24_PAY_RATE
    when 25..100
      PayRate::NORMAL_25_PLUS_PAY_RATE
    else
      raise_wrond_age_exception
    end
  end

  def pay_rate_from_bolton_group
    case staff_member_age
    when 18..20
      PayRate::BOLTON_LEVEL_18_20_PAY_RATE
    when 21..24
      PayRate::BOLTON_LEVEL_21_24_PAY_RATE
    when 25..100
      PayRate::BOLTON_LEVEL_25_PLUS_PAY_RATE
    else
      raise_wrond_age_exception
    end
  end

  def pay_rate_from_bar_supervisor_group
    case staff_member_age
    when 18..24
      PayRate::BAR_SUPERVISOR_PAY_RATE
    when 25..100
      PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE
    else
      raise_wrond_age_exception
    end
  end

  def pay_rate_by_name(pay_rate_name:)
    pay_rate = PayRate.find_by(name: pay_rate_name)
    unless pay_rate.present?
      raise PayRateException.new("PayRate (#{pay_rate_name}) doesn't present in data base")
      # raise "PayRate (#{pay_rate_name}) doesn't present in data base"
    end
    pay_rate
  end

  def new_payrate_data(new_pay_rate_name:)
    if new_pay_rate_name != staff_member_pay_rate_name
      pay_rate_by_name(pay_rate_name: new_pay_rate_name)
    else
      nil
    end
  end

  def staff_member_pay_rate_name
    staff_member.pay_rate.name
  end

  def staff_member_age
    unless staff_member.date_of_birth.present?
      raise PayRateException.new("#{staff_member.full_name} with ID: #{staff_member.id}, from #{staff_member.master_venue.andand.name} venue: doesn't have date of birth setup")
    end
    now.year - staff_member.date_of_birth.year
  end

  def raise_wrond_age_exception
    raise PayRateException.new("#{staff_member.full_name} with ID: #{staff_member.id}, from #{staff_member.master_venue.andand.name} venue: has a wrong age(#{staff_member_age})")
  end

  def raise_wrond_pay_rate_exception
    raise PayRateException.new("#{staff_member.full_name} with ID: #{staff_member.id}, from #{staff_member.master_venue.andand.name} venue: has wrong pay rate (#{staff_member_pay_rate_name})")
  end

  attr_reader :now, :staff_member
end
