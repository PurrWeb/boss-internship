require 'active_support/testing/time_helpers'

class AssociateFinanceReportsWithExistingRecords < ActiveRecord::Migration
  include ActiveSupport::Testing::TimeHelpers

  class FinanceReportStateMachine
    include Statesman::Machine

    REQUIRING_UPDATE_STATE = :requiring_update
    INCOMPLETE_STATE = :incomplete
    READY_STATE = :ready
    DONE_STATE = :done
    INITIAL_STATE = REQUIRING_UPDATE_STATE
    ALL_STATES = [REQUIRING_UPDATE_STATE, INCOMPLETE_STATE, READY_STATE, DONE_STATE]

    state REQUIRING_UPDATE_STATE, initial: true
    state INCOMPLETE_STATE
    state READY_STATE
    state DONE_STATE

    transition from: REQUIRING_UPDATE_STATE, to: [INCOMPLETE_STATE, READY_STATE]
    transition from: INCOMPLETE_STATE, to: [REQUIRING_UPDATE_STATE, READY_STATE]
    transition from: READY_STATE, to: [DONE_STATE, REQUIRING_UPDATE_STATE]
    transition from: DONE_STATE, to: [REQUIRING_UPDATE_STATE, READY_STATE]

    after_transition(to: :requiring_update) do |finance_report, transition|
      finance_report.requiring_update = true
      finance_report.save!
    end

    after_transition(to: ALL_STATES - [REQUIRING_UPDATE_STATE]) do |finance_report, transition|
      finance_report.requiring_update = false
      finance_report.save!
    end
  end

  class FinanceReportTransition < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordTransition
    belongs_to :finance_report, inverse_of: :finance_report_transitions
  end

  class FinanceReport < ActiveRecord::Base
    REPORT_STATUS_INCOMPLETE_STATUS = 'incomplete'
    REPORT_STATUS_READY_STATUS = 'ready'
    REPORT_STATUS_DONE_STATUS = 'done'

    include Statesman::Adapters::ActiveRecordQueries

    belongs_to :staff_member
    belongs_to :venue
    has_many :finance_report_transitions, autosave: false

    validates :staff_member, presence: true
    validates :venue, presence: true
    validates :week_start, presence: true
    validates :requiring_update, inclusion: { in: [true, false], message: 'is required' }

    attr_accessor :allow_mark_completed
    attr_accessor :override_status_match_validation

    def current_state
      state_machine.current_state
    end

    def incomplete?
      current_state == FinanceReportStateMachine::INCOMPLETE_STATE.to_s
    end

    def ready?
      current_state == FinanceReportStateMachine::READY_STATE.to_s
    end

    def in_requiring_update_state?
      current_state == FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s
    end

    def done?
      current_state == FinanceReportStateMachine::DONE_STATE.to_s
    end

    def mark_requiring_update!
      ActiveRecord::Base.transaction do
        state_machine.transition_to!(FinanceReportStateMachine::REQUIRING_UPDATE_STATE)
      end
    end

    def mark_incomplete!
      ActiveRecord::Base.transaction do
        state_machine.transition_to!(FinanceReportStateMachine::INCOMPLETE_STATE)
      end
    end

    def mark_ready!
      ActiveRecord::Base.transaction do
        state_machine.transition_to!(FinanceReportStateMachine::READY_STATE)
      end
    end

    def mark_completed!
      raise 'Allow mark completed not set' unless allow_mark_completed
      ActiveRecord::Base.transaction do
        state_machine.transition_to!(FinanceReportStateMachine::DONE_STATE)
      end
    end

    def self.transition_class
      FinanceReportTransition
    end

    def self.initial_state
      FinanceReportStateMachine::INITIAL_STATE
    end
    private_class_method :initial_state

    private
    def state_machine
      @state_machine ||= FinanceReportStateMachine.new(self, transition_class: FinanceReportTransition)
    end
  end

  class Name < ActiveRecord::Base
    def full_name
      [first_name, surname].join(' ')
    end
  end

  class HoursAcceptancePeriod < ActiveRecord::Base
    has_paper_trail

    ACCEPTED_STATE = 'accepted'

    belongs_to :clock_in_day
    belongs_to :finance_report

    def self.accepted
      where(status: ACCEPTED_STATE)
    end
  end

  class StaffMember < ActiveRecord::Base
    belongs_to :master_venue, class_name: 'Venue', inverse_of: :master_staff_members
    belongs_to :name
    belongs_to :pay_rate
    delegate :full_name, to: :name
  end

  class PayRate < ActiveRecord::Base
    include ActionView::Helpers::NumberHelper

    def rate_in_pounds
      if cents.present?
        cents / 100.0
      else
        0
      end
    end

    def text_description_short
      result = "#{number_to_currency(rate_in_pounds, unit: '£')}"
      result = result + PayRate.calculation_type_per_message_short(calculation_type)
      result
    end

    def self.calculation_type_per_message_short(calculation_type)
      case calculation_type
      when 'incremental_per_hour'
        '/h'
      when 'salary_per_week'
        '/Wk'
      else
        raise ArgumentError, "invalid calculation_type #{calculation_type} supplied"
      end
    end
  end

  class Venue < ActiveRecord::Base
    has_many :master_staff_members, class_name: 'StaffMember', inverse_of: :master_venue, foreign_key: :master_venue_id
  end

  class ClockInDay < ActiveRecord::Base
    belongs_to :staff_member
  end

  class HolidayTransition < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordTransition

    belongs_to :holiday, inverse_of: :holiday_transitions
  end

  class HolidayStateMachine
    include Statesman::Machine

    state :enabled, initial: true
    state :disabled

    transition from: :enabled, to: [:disabled]
    transition from: :disabled, to: [:enabled]
  end

  class Holiday < ActiveRecord::Base
    belongs_to :staff_member
    belongs_to :finance_report
    has_many :holiday_transitions, autosave: false

    include Statesman::Adapters::ActiveRecordQueries

    def state_machine
      @state_machine ||= HolidayStateMachine.new(
        self,
        transition_class: HolidayTransition,
        association_name: :holiday_transitions
      )
    end

    def current_state
      state_machine.current_state
    end

    def self.enabled
      in_state(:enabled)
    end

    private
    # Needed for statesman
    def self.transition_class
      HolidayTransition
    end

    def self.initial_state
      HolidayStateMachine.initial_state
    end
  end

  class OwedHour < ActiveRecord::Base
    belongs_to :staff_member
    belongs_to :finance_report

    def self.enabled
      where(disabled_at: nil)
    end
  end

  class AccessoryRequest < ActiveRecord::Base
    belongs_to :staff_member
    belongs_to :finance_report
  end

  class AccessoryRefundRequest < ActiveRecord::Base
    belongs_to :staff_member
    belongs_to :finance_report
  end

  def find_or_create_report(week:, venue:, staff_member:)
    week_start = week.start_date
    finance_report = FinanceReport.find_by(
      staff_member: staff_member,
      week_start: week_start
    )

    if finance_report.present?
      finance_report
    else
      FinanceReport.create!(
        staff_member: staff_member,
        staff_member_name: staff_member.full_name,
        week_start: week_start,
        venue: venue,
        venue_name: venue.name,
        pay_rate_description: staff_member.pay_rate.text_description_short,
        requiring_update: true
      )
    end
  end

  def change
    ActiveRecord::Base.logger.level = Logger::FATAL
    ActiveRecord::Base.transaction do
      puts "Marking existing finance reports as completed"
      puts "************************************"
      finance_reports = FinanceReport.all
      puts "processing #{finance_reports.count} records"
      puts ""
      finance_reports.find_each do |finance_report|
        created_at = finance_report.created_at
        travel_to created_at do
          finance_report.mark_ready!
          finance_report.allow_mark_completed = true
          finance_report.mark_completed!
        end
      end


      puts "Patch acccepted HoursAcceptancePeriods"
      puts "************************************"
      hours_acceptance_periods = HoursAcceptancePeriod.
        accepted.
        where(finance_report_id: nil)
      puts "processing #{hours_acceptance_periods.count} records"
      puts ""

      hours_acceptance_periods.
        includes(clock_in_day: [staff_member: [:name, :master_venue, :pay_rate]]).
        find_each do |hours_acceptance_period|
          date = hours_acceptance_period.clock_in_day.date
          week = RotaWeek.new(date)
          staff_member = hours_acceptance_period.clock_in_day.staff_member
          venue = staff_member.master_venue
          #security staff have no master venue
          next unless venue.present?

          finance_report = find_or_create_report(week: week, venue: venue, staff_member: staff_member)
          if !finance_report.in_requiring_update_state?
            finance_report.mark_requiring_update!
          end
          hours_acceptance_period.update_attributes!(finance_report: finance_report)
        end

      puts "Patch acccepted Holidays"
      puts "************************************"
      holidays = Holiday.
        enabled.
        where(finance_report_id: nil)
      puts "processing #{holidays.count} records"
      puts ""

      holidays.
        includes(staff_member: [:name, :master_venue, :pay_rate]).
        find_each do |holiday|
          date = holiday.payslip_date
          week = RotaWeek.new(date)
          staff_member = holiday.staff_member
          venue = staff_member.master_venue
          #security staff have no master venue
          next unless venue.present?

          finance_report = find_or_create_report(week: week, venue: venue, staff_member: staff_member)
          if !finance_report.in_requiring_update_state?
            finance_report.mark_requiring_update!
          end
          holiday.update_attributes!(finance_report: finance_report)
        end

      puts "Patch acccepted OwedHours"
      puts "************************************"
      owed_hours = OwedHour.
        enabled.
        where(finance_report_id: nil)
      puts "processing #{owed_hours.count} records"
      puts ""

      owed_hours.
        includes(staff_member: [:name, :master_venue, :pay_rate]).
        find_each do |owed_hour|
          date = owed_hour.payslip_date
          week = RotaWeek.new(date)
          staff_member = owed_hour.staff_member
          venue = staff_member.master_venue
          #security staff have no master venue
          next unless venue.present?

          finance_report = find_or_create_report(week: week, venue: venue, staff_member: staff_member)
          if !finance_report.in_requiring_update_state?
            finance_report.mark_requiring_update!
          end
          owed_hour.update_attributes!(finance_report: finance_report)
        end

      puts "Patch acccepted AccessoryRefundRequests"
      puts "************************************"
      accessory_refund_requests = AccessoryRefundRequest.
        where("`completed_at` IS NOT ?", nil).
        where(finance_report_id: nil)
      puts "processing #{accessory_refund_requests.count} records"
      puts ""

      accessory_refund_requests.
        includes(staff_member: [:name, :master_venue, :pay_rate]).
        find_each do |accessory_refund_request|
          date = GetPayslipDate.new(item_date: RotaShiftDate.to_rota_date(accessory_refund_request.completed_at)).call
          week = RotaWeek.new(date)
          staff_member = accessory_refund_request.staff_member
          venue = staff_member.master_venue
          #security staff have no master venue
          next unless venue.present?

          finance_report = find_or_create_report(week: week, venue: venue, staff_member: staff_member)
          if !finance_report.in_requiring_update_state?
            finance_report.mark_requiring_update!
          end
          accessory_refund_request.update_attributes!(finance_report: finance_report)
        end

      puts "Patch acccepted AccessoryRequests"
      puts "************************************"
      accessory_requests = AccessoryRequest.
        where("`completed_at` IS NOT ?", nil).
        where(finance_report_id: nil)
      puts "processing #{accessory_requests.count} records"
      puts ""

      accessory_requests.
        includes(staff_member: [:name, :master_venue, :pay_rate]).
        find_each do |accessory_request|
          date = GetPayslipDate.new(item_date: RotaShiftDate.to_rota_date(accessory_request.completed_at)).call
          week = RotaWeek.new(date)
          staff_member = accessory_request.staff_member
          venue = staff_member.master_venue
          #security staff have no master venue
          next unless venue.present?

          finance_report = find_or_create_report(week: week, venue: venue, staff_member: staff_member)
          if !finance_report.in_requiring_update_state?
            finance_report.mark_requiring_update!
          end
          accessory_request.update_attributes!(finance_report: finance_report)
        end
    end
  end
end
