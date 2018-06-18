class StaffMemberRealPayRate
  def initialize(now: Time.now, staff_member:)
    @now = now
    @staff_member = staff_member
  end
  attr_reader :now, :staff_member

  def call
    case staff_member_pay_rate_name
    when *PayRate::PAY_RATE_GROUPS[:normal]
      pay_rate_from_normal_group_for(age: staff_member.age)
    when *PayRate::PAY_RATE_GROUPS[:bar_supervisor]
      pay_rate_from_bar_supervisor_group_for(age: staff_member.age)
    when *PayRate::PAY_RATE_GROUPS[:bolton]
      pay_rate_from_bolton_group_for(age: staff_member.age)
    else
      raise_wrond_pay_rate_exception
    end
  end

  private
  def pay_rate_from_normal_group_for(age:)
    case age
    when 18..20
      PayRate.from_name(PayRate::NORMAL_18_20_PAY_RATE)
    when 21..24
      PayRate.from_name(PayRate::NORMAL_21_24_PAY_RATE)
    when 25..100
      PayRate.from_name(PayRate::NORMAL_25_PLUS_PAY_RATE)
    else
      raise_wrond_age_exception
    end
  end

  def pay_rate_from_bolton_group_for(age:)
    case age
    when 18..20
      PayRate.from_name(PayRate::BOLTON_LEVEL_18_20_PAY_RATE)
    when 21..24
      PayRate.from_name(PayRate::BOLTON_LEVEL_21_24_PAY_RATE)
    when 25..100
      PayRate.from_name(PayRate::BOLTON_LEVEL_25_PLUS_PAY_RATE)
    else
      raise_wrond_age_exception
    end
  end

  def pay_rate_from_bar_supervisor_group_for(age:)
    case age
    when 18..24
      PayRate.from_name(PayRate::BAR_SUPERVISOR_PAY_RATE)
    when 25..100
      PayRate.from_name(PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE)
    else
      raise_wrond_age_exception
    end
  end

  def staff_member_pay_rate_name
    staff_member.pay_rate.name
  end

  def raise_wrond_age_exception
    raise PayRateException.new("Staff Member with ID: #{staff_member.id}, has invalid age(#{staff_member.age})")
  end

  def raise_wrond_pay_rate_exception
    raise PayRateException.new("Staff Member with ID: #{staff_member.id}, has invalid pay rate (#{staff_member_pay_rate_name})")
  end
end
