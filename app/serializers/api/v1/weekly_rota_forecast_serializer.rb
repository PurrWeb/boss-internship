class Api::V1::WeeklyRotaForecastSerializer < ActiveModel::Serializer
  attributes :date, :forecasted_take_cents, :total_cents, :total_percentage,
             :overhead_total_cents, :overhead_total_percentage, :staff_total_cents,
             :staff_total_percentage, :pr_total_cents, :pr_total_percentage,
             :kitchen_total_cents, :kitchen_total_percentage, :security_total_cents,
             :security_total_percentage, :venue_overheads_threshold_percentage,
             :venue_staff_threshold_percentage, :venue_pr_threshold_percentage,
             :venue_kitchen_threshold_percentage, :venue_security_threshold_percentage

  def date
    instance_options[:scope][:week].start_date.iso8601
  end

  def forecasted_take_cents
    object.forecasted_take_cents
  end

  def total_cents
    object.total_cents
  end

  def total_percentage
    object.total_percentage
  end

  def overhead_total_cents
    object.overhead_total_cents
  end

  def overhead_total_percentage
    object.overhead_total_percentage
  end

  def staff_total_cents
    object.staff_total_cents
  end

  def staff_total_percentage
    object.staff_total_percentage
  end

  def pr_total_cents
    object.pr_total_cents
  end

  def pr_total_percentage
    object.pr_total_percentage
  end

  def kitchen_total_cents
    object.kitchen_total_cents
  end

  def kitchen_total_percentage
    object.kitchen_total_percentage
  end

  def security_total_cents
    object.security_total_cents
  end

  def security_total_percentage
    object.security_total_percentage
  end

  def venue_overheads_threshold_percentage
    object.venue.overheads_threshold_percentage
  end

  def venue_staff_threshold_percentage
    object.venue.staff_threshold_percentage
  end

  def venue_pr_threshold_percentage
    object.venue.pr_threshold_percentage
  end

  def venue_kitchen_threshold_percentage
    object.venue.kitchen_threshold_percentage
  end

  def venue_security_threshold_percentage
    object.venue.security_threshold_percentage
  end
end
