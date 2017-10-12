class MachinesRefloat < ActiveRecord::Base
  belongs_to :user
  belongs_to :machine  

  validates :last_machine_refloat_id, presence: true, if: :last_machine_refloat_present?
  validates :refill_x_10p, presence: true
  validates :cash_in_x_10p, presence: true
  validates :cash_out_x_10p, presence: true
  validate :should_be_more_than_was
  validate :calculated_float_topup_should_match
  validate :calculated_money_banked_should_match
  
  before_validation :set_last_machine_refloat_id
  before_validation :set_calculated_fields

  attr_accessor :float_topup_error, :money_banked_error 

  def set_last_machine_refloat_id
    if last_machine_refloat_present?
      self.last_machine_refloat_id = machine.machines_refloats.last.id
    end
  end

  def set_calculated_fields
    machines_refloat_calculations = MachinesRefloatsCalculationService.new(machines_refloat: self).call
    self.calculated_float_topup_cents = machines_refloat_calculations.fetch(:calculated_float_topup_cents)
    self.calculated_money_banked_cents = machines_refloat_calculations.fetch(:calculated_money_banked_cents)
  end

  def last_machine_refloat_present?
    machine.machines_refloats.count > 0
  end

  def calculated_float_topup_should_match
    unless calculated_float_topup_cents == float_topup_cents
      unless float_topup_note.present?
        errors.add(:float_topup_note, "Please add a note to explain why this value doesn't match our calculated amount")
        errors.add(:float_topup_error)
      end
    end
  end

  def calculated_money_banked_should_match
    unless calculated_money_banked_cents == money_banked_cents
      unless money_banked_note.present?
        errors.add(:money_banked_note, "Please add a note to explain why this value doesn't match our calculated amount")
        errors.add(:money_banked_error)
      end
    end
  end

  def should_be_more_than_was
    last_machine_refloat = machine.machines_refloats.last
    if last_machine_refloat ? (refill_x_10p < last_machine_refloat.refill_x_10p) : (refill_x_10p < machine.initial_refill_x_10p)
      errors.add(:refill_x_10p, "Should be more than previous")
    end
    if last_machine_refloat ? (cash_in_x_10p < last_machine_refloat.cash_in_x_10p) : (cash_in_x_10p < machine.initial_cash_in_x_10p)
      errors.add(:cash_in_x_10p, "Should be more than previous")
    end
    if last_machine_refloat ? (cash_out_x_10p < last_machine_refloat.cash_out_x_10p) : (cash_out_x_10p < machine.initial_cash_out_x_10p)
      errors.add(:cash_out_x_10p, "Should be more than previous")
    end
  end
end
