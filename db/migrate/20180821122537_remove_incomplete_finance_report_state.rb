class RemoveIncompleteFinanceReportState < ActiveRecord::Migration
  class FinanceReport < ActiveRecord::Base
    REPORT_STATUS_INCOMPLETE_STATUS = 'incomplete'
    REPORT_STATUS_READY_STATUS = 'ready'
    REPORT_STATUS_DONE_STATUS = 'done'

    include Statesman::Adapters::ActiveRecordQueries

    has_many :finance_report_transitions, autosave: false
    validates :requiring_update, inclusion: { in: [true, false], message: 'is required' }
    validate :requiring_update_matches_status

    # Used by services to makes statesman play well with our validations
    attr_accessor :override_status_match_validation

    # validation
    def requiring_update_matches_status
      if (
        !override_status_match_validation && (
          (in_requiring_update_state? && requiring_update != true) ||
          (!in_requiring_update_state? && requiring_update != false)
        )
      )
        errors.add(:requiring_update, 'must match status')
      end
    end

    def current_state
      state_machine.current_state
    end

    def in_requiring_update_state?
      current_state == FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s
    end

    def incomplete?
      current_state == FinanceReportStateMachine::INCOMPLETE_STATE.to_s
    end

    def ready?
      current_state == FinanceReportStateMachine::READY_STATE.to_s
    end

    def mark_ready!
      ActiveRecord::Base.transaction do
        state_machine.transition_to!(FinanceReportStateMachine::READY_STATE)
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

  class FinanceReportTransition < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordTransition
    belongs_to :finance_report, inverse_of: :finance_report_transitions
  end

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

    transition from: REQUIRING_UPDATE_STATE, to: [INCOMPLETE_STATE, READY_STATE, REQUIRING_UPDATE_STATE]
    transition from: INCOMPLETE_STATE, to: [REQUIRING_UPDATE_STATE, READY_STATE]
    transition from: READY_STATE, to: [DONE_STATE, REQUIRING_UPDATE_STATE]
    transition from: DONE_STATE, to: [REQUIRING_UPDATE_STATE, READY_STATE]

    guard_transition(to: REQUIRING_UPDATE_STATE) do |finance_report|
      old_value = finance_report.requiring_update

      finance_report.requiring_update = true
      finance_report.override_status_match_validation = true
      would_be_valid = finance_report.valid?

      finance_report.requiring_update = old_value
      finance_report.override_status_match_validation = false
      would_be_valid
    end

    guard_transition(to: ALL_STATES - [REQUIRING_UPDATE_STATE]) do |finance_report|
      old_value = finance_report.requiring_update

      finance_report.requiring_update = false
      finance_report.override_status_match_validation = true
      would_be_valid = finance_report.valid?

      finance_report.requiring_update = old_value
      finance_report.override_status_match_validation = false
      would_be_valid
    end

    after_transition(to: :requiring_update) do |finance_report, transition|
      finance_report.requiring_update = true
      finance_report.save!
    end

    after_transition(to: ALL_STATES - [REQUIRING_UPDATE_STATE]) do |finance_report, transition|
      finance_report.requiring_update = false
      finance_report.save!
    end
  end

  def change
    incomplete_reports = FinanceReport.in_state(:incomplete)

    incomplete_reports.each do |finance_report|
      finance_report.mark_ready!
    end
  end
end
