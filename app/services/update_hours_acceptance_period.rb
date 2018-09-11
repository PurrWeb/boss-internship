class UpdateHoursAcceptancePeriod
  class Result < Struct.new(:success, :hours_acceptance_period, :hours_acceptance_breaks, :api_errors)
    def success?
      success
    end
  end

  def initialize(hours_acceptance_period:, starts_at:, ends_at:, status:, breaks_data:, reason_note:, requester:)
    @hours_acceptance_period = hours_acceptance_period
    @starts_at = starts_at
    @ends_at = ends_at
    @status = status
    @breaks_data = breaks_data
    @reason_note = reason_note
    @requester = requester
  end

  def call(call_time: Time.current)
    result = true
    breaks = []

    if !hours_acceptance_period.editable?
      hours_acceptance_period.errors.add(:base, "these hours are not editable")
      api_errors = HourAcceptancePeriodApiErrors.new(hour_acceptance_period: hours_acceptance_period, breaks: breaks)
      Result.new(false, hours_acceptance_period, breaks, api_errors)
    else
      ActiveRecord::Base.transaction do
        old_status = hours_acceptance_period.status

        hours_acceptance_period.assign_attributes(
          starts_at: starts_at,
          ends_at: ends_at,
          reason_note: reason_note,
          status: status
        )
        if status == HoursAcceptancePeriod::ACCEPTED_STATE
          hours_acceptance_period.assign_attributes({
            accepted_at: call_time.utc,
            accepted_by: requester,
          })
        else
          hours_acceptance_period.assign_attributes({
            accepted_at: nil,
            accepted_by: nil,
          })
        end

        accepting = (status == HoursAcceptancePeriod::ACCEPTED_STATE) && (old_status != HoursAcceptancePeriod::ACCEPTED_STATE)
        unaccecpting = (old_status == HoursAcceptancePeriod::ACCEPTED_STATE) && (status != HoursAcceptancePeriod::ACCEPTED_STATE)

        clock_in_day = hours_acceptance_period.clock_in_day
        week = RotaWeek.new(clock_in_day.date)
        staff_member = hours_acceptance_period.staff_member
        if staff_member.can_have_finance_reports?
          if accepting
            finance_report = MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call
            hours_acceptance_period.finance_report = finance_report
          elsif unaccecpting
            hours_acceptance_period.finance_report = nil
            MarkFinanceReportRequiringUpdate.new(staff_member: staff_member, week: week).call
          end
        end

        existing_breaks = hours_acceptance_period.hours_acceptance_breaks.enabled.includes(:disabled_by)
        delete_breaks = existing_breaks
        if update_breaks_ids.count > 0
          delete_breaks = existing_breaks.where('id NOT IN (?)', update_breaks_ids)
        end

        delete_breaks.find_each do |_break|
          break_disabled =  _break.disable(requester: requester)
          result = result && break_disabled
        end

        update_break_data.each do |break_data|
          _break = hours_acceptance_period.
            hours_acceptance_breaks.
            find_by!(id: break_data.fetch(:id))

          break_updated = _break.update_attributes(
            starts_at: break_data.fetch(:startsAt),
            ends_at: break_data.fetch(:endsAt)
          )

          breaks << _break
          result = result && break_updated
        end

        new_break_data.each do |break_data|
          _break = HoursAcceptanceBreak.new(
            starts_at: break_data.fetch(:startsAt),
            ends_at: break_data.fetch(:endsAt),
            hours_acceptance_period: hours_acceptance_period
          )
          break_created = _break.save
          hours_acceptance_period.hours_acceptance_breaks << _break
          breaks << _break

          result = result && break_created
        end

        period_saved = hours_acceptance_period.save
        result = result && period_saved

        if result
          DailyReport.mark_for_update!(
            date: hours_acceptance_period.date,
            venue: hours_acceptance_period.venue
          )
        end

        raise ActiveRecord::Rollback unless result
      end
      api_errors = nil
      unless result
        unsupported_errors = []
        unsupported_errors << "paysliip_date: #{hours_acceptance_period.errors[:payslip_date]}" if hours_acceptance_period.errors[:payslip_date].present?
        unsupported_errors << "finance_report: #{hours_acceptance_period.errors[:finance_report]}" if hours_acceptance_period.errors[:finance_report].present?
        raise unsupported_errors.join(", ") if unsupported_errors.present?

        api_errors = HourAcceptancePeriodApiErrors.new(hour_acceptance_period: hours_acceptance_period, breaks: breaks)
      end
      Result.new(result, hours_acceptance_period, breaks, api_errors)
    end
  end

  private
  attr_reader :hours_acceptance_period, :starts_at, :ends_at, :status, :requester, :breaks_data, :reason_note

  def update_break_data
    breaks_data.select do |break_data|
      break_data[:id].present?
    end
  end

  def update_breaks_ids
    update_break_data.map do |break_data|
      Integer(break_data.fetch(:id))
    end
  end

  def new_break_data
    breaks_data.reject do |break_data|
      break_data[:id].present?
    end
  end
end
