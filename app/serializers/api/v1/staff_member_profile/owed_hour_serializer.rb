class Api::V1::StaffMemberProfile::OwedHourSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :minutes,
    :date,
    :startsAt,
    :endsAt,
    :editable,
    :hasDate,
    :payslipDate,
    :createdAt,
    :createdBy,
    :note,
    :frozen

  def date
    UIRotaDate.format(object.date)
  end

  def startsAt
    object.starts_at.andand.iso8601
  end

  def endsAt
    object.ends_at.andand.iso8601
  end

  def editable
    object.editable?
  end

  def hasDate
    object.has_times?
  end

  def payslipDate
    UIRotaDate.format(object.payslip_date)
  end

  def createdAt
    object.created_at.iso8601
  end

  def createdBy
    object.creator.full_name
  end

  def frozen
    object.boss_frozen?
  end
end
