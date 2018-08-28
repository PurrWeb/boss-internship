class BackfillAccessoryPayslipDates < ActiveRecord::Migration
  class AccessoryRequestStateMachine
    include Statesman::Machine

    state :pending, initial: true
    state :accepted
    state :rejected
    state :canceled
    state :completed
  end

  class AccessoryRequestTransition < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordTransition
    belongs_to :accessory_request, inverse_of: :accessory_request_transitions
  end

  class AccessoryRequest < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordQueries

    has_many :accessory_request_transitions

    def state_machine
      @state_machine ||= AccessoryRequestStateMachine.new(
        self,
        transition_class: AccessoryRequestTransition,
        association_name: :accessory_request_transitions)
    end

    def self.transition_class
      AccessoryRequestTransition
    end

    def self.initial_state
      AccessoryRequestStateMachine.initial_state
    end
  end

  class AccessoryRefundRequestStateMachine
    include Statesman::Machine

    state :pending, initial: true
    state :accepted
    state :rejected
    state :completed
  end

  class AccessoryRefundRequestTransition < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordTransition
    belongs_to :accessory_refund_request, inverse_of: :accessory_refund_request_transitions
  end

  class AccessoryRefundRequest < ActiveRecord::Base
    include Statesman::Adapters::ActiveRecordQueries

    has_many :accessory_refund_request_transitions

    def state_machine
      @state_machine ||= AccessoryRefundRequestStateMachine.new(
        self,
        transition_class: AccessoryRefundRequestTransition,
        association_name: :accessory_refund_request_transitions)
    end

    def self.transition_class
      AccessoryRefundRequestTransition
    end

    def self.initial_state
      AccessoryRefundRequestStateMachine.initial_state
    end
  end

  def change
    AccessoryRequest.
      in_state(:completed).
      where(payslip_date: nil).
      find_each do |accessory_request|
        new_payslip_date = RotaWeek.new(RotaShiftDate.to_rota_date(accessory_request.completed_at)).start_date
        accessory_request.update_attributes!(payslip_date: new_payslip_date)
    end

    AccessoryRefundRequest.
      in_state(:completed).
      where(payslip_date: nil).
      find_each do |accessory_refund_request|
        new_payslip_date = RotaWeek.new(RotaShiftDate.to_rota_date(accessory_refund_request.completed_at)).start_date

        accessory_refund_request.update_attributes!(payslip_date: new_payslip_date)
    end
  end
end
