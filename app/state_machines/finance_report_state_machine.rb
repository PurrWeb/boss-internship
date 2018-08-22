class FinanceReportStateMachine
  include Statesman::Machine

  REQUIRING_UPDATE_STATE = :requiring_update
  READY_STATE = :ready
  DONE_STATE = :done
  INITIAL_STATE = REQUIRING_UPDATE_STATE
  ALL_STATES = [REQUIRING_UPDATE_STATE, READY_STATE, DONE_STATE]

  state REQUIRING_UPDATE_STATE, initial: true
  state READY_STATE
  state DONE_STATE

  transition from: REQUIRING_UPDATE_STATE, to: [READY_STATE, REQUIRING_UPDATE_STATE]
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
