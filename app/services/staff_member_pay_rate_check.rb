class StaffMemberPayRateCheck
  def initialize(now: Time.now, staff_member:)
    @now = now
    @staff_member = staff_member
  end

  def pay_rate_id_by_name(pay_rate_name:)
    pay_rate = PayRate.find_by(name: pay_rate_name)
    unless pay_rate.present?
      raise "PayRate (#{pay_rate_name}) doesn't present in data base"
    end
    pay_rate.id
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
      raise "#{staff_member.full_name}'s has wrong pay rate (#{staff_member_pay_rate_name})"
    end
  end

  def pay_rate_from_normal_group
    case staff_member_age
    when 18..20
      PayRate::NORMAL_18_20_PAY_RATE
    when 21..24
      PayRate::NORMAL_21_24_PAY_RATE
    when 25..100
      PayRate::NORMAL_25_PLUS_PAY_RATE
    else
      raise "#{staff_member.full_name}: has a wrong age(#{staff_member_age}) or staff type (#{staff_member.staff_type.name})"
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
      raise "#{staff_member.full_name}: has a wrong age(#{staff_member_age}) or staff type (#{staff_member.staff_type.name})"
    end
  end

  def pay_rate_from_bar_supervisor_group
    case staff_member_age
    when 18..24
      PayRate::BAR_SUPERVISOR_PAY_RATE
    when 25..100
      PayRate::BAR_SUPERVISOR_25_PLUS_PAY_RATE
    else
      raise "#{staff_member.full_name}: has a wrong age(#{staff_member_age}) or staff type (#{staff_member.staff_type.name})"
    end
  end

  private

  def new_payrate_data(new_pay_rate_name:)
    if new_pay_rate_name != staff_member_pay_rate_name
      {
        name: new_pay_rate_name,
        id: pay_rate_id_by_name(pay_rate_name: new_pay_rate_name),
        was: staff_member_pay_rate_name,
        age: staff_member_age
      }
    else
      nil
    end
  end

  def staff_member_pay_rate_name
    staff_member.pay_rate.name
  end

  def staff_member_age
    unless staff_member.date_of_birth.present?
      raise "#{staff_member.full_name} doesn't have date of birth setup"
    end
    now.year - staff_member.date_of_birth.year
  end

  attr_reader :now, :staff_member
end
