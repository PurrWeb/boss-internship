class SafeCheck < ActiveRecord::Base
  POUND_FIELDS = [:fifty_pound_note_pounds, :twenty_pound_note_pounds, :ten_pound_note_pounds, :five_pound_note_pounds, :two_pound_coins_pounds, :one_pound_coins_pounds]
  VALIDATABLE_CENT_FIELDS = [:fifty_pence_coins_cents, :twenty_pence_coins_cents, :ten_pence_coins_cents, :five_pence_coins_cents]
  CENTS_FIELDS = VALIDATABLE_CENT_FIELDS + [:coppers_cents, :safe_float_cents, :till_float_cents, :total_float_cents, :out_to_order_cents, :other_cents, :payouts_cents, :ash_cash_cents, :security_plus_cents]
  TOTAL_FIELDS = POUND_FIELDS + VALIDATABLE_CENT_FIELDS + [:coppers_cents, :other_cents, :payouts_cents]

  belongs_to :venue
  belongs_to :creator, class_name: "User", foreign_key: "creator_user_id"

  has_many :notes, class_name: "SafeCheckNote"
  has_many :enabled_notes, lambda { enabled }, class_name: "SafeCheckNote"

  validates :venue, presence: true
  validates :creator, presence: true
  validates :checked_by_note, presence: true
  validate :note_if_negative

  validates :fifty_pound_note_pounds,
    numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validates :twenty_pound_note_pounds,
    numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validates :ten_pound_note_pounds,
    numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validates :five_pound_note_pounds,
    numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validates :two_pound_coins_pounds,
    numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validates :one_pound_coins_pounds,
    numericality: {greater_than_or_equal_to: 0, only_integer: true}
  validates :fifty_pence_coins_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :twenty_pence_coins_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :ten_pence_coins_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :five_pence_coins_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :coppers_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :safe_float_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :till_float_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :out_to_order_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :other_cents,
    numericality: {greater_than_or_equal_to: 0}
  validates :payouts_cents,
            numericality: {greater_than_or_equal_to: 0}

  auto_strip_attributes :checked_by_note, convert_non_breaking_spaces: true, squish: true

  POUND_FIELDS.each do |field|
    validate do
      pound_value = SafeCheck.amount_for(field)
      if public_send(field).present? && !((public_send(field) % pound_value) == 0)
        errors.add(field, "must be multiple of £#{pound_value}")
      end
    end
  end

  VALIDATABLE_CENT_FIELDS.each do |field|
    validate do
      cent_value = SafeCheck.amount_for(field)
      if public_send(field).present? && !((public_send(field) % cent_value) == 0)
        errors.add(field, "must be multiple of #{cent_value}p")
      end
    end
  end

  #validation
  def note_if_negative
    if (variance_cents || 0) < 0
      errors.add(:base, "Note required when variance is negative") if enabled_notes.length == 0
    end
  end

  def total_cents
    total = nil
    if total_cents_prerequsites_present?
      total = 0
      TOTAL_FIELDS.each do |field|
        total = total + cent_value_for(field)
      end
    end
    total
  end

  def total_float_cents
    if till_float_cents.present? && safe_float_cents.present?
      till_float_cents + safe_float_cents
    end
  end

  def total_cents_prerequsites_present?
    TOTAL_FIELDS.map { |f| public_send(f) }.all?(&:present?)
  end

  def variance_cents
    total_cents + out_to_order_cents - safe_float_cents if (total_cents.present? && out_to_order_cents.present? && safe_float_cents.present?)
  end

  def pound_value_for(field)
    if ([:total_cents, :variance_cents] + CENTS_FIELDS).include?(field)
      (public_send(field) || 0.0) / 100.0
    elsif POUND_FIELDS.include?(field)
      Float(public_send(field) || 0.0)
    else
      raise "#{field} field usupported"
    end
  end

  def cent_value_for(field)
    if CENTS_FIELDS.include?(field)
      public_send(field) || 0
    elsif POUND_FIELDS.include?(field)
      ((public_send(field) || 0) * 100).floor
    else
      raise "#{field} field usupported"
    end
  end

  def self.label_for(field)
    {
      fifty_pound_note_pounds: "£50 Notes",
      twenty_pound_note_pounds: "£20 Notes",
      ten_pound_note_pounds: "£10 Notes ",
      five_pound_note_pounds: "£5 Notes",
      two_pound_coins_pounds: "£2 Coins",
      one_pound_coins_pounds: "£1 Coins",
      fifty_pence_coins_cents: "50p Coins",
      twenty_pence_coins_cents: "20p Coins",
      ten_pence_coins_cents: "10p Coins",
      five_pence_coins_cents: "5p Coins",
      coppers_cents: "Coppers",
      other_cents: "Other",
      payouts_cents: "Payouts",
      safe_float_cents: "Safe Float",
      till_float_cents: "Till Float",
      total_float_cents: "Total Float",
      out_to_order_cents: "Out to order",
      ash_cash_cents: "Ash Cash",
      security_plus_cents: "Security Plus",
    }.fetch(field)
  end

  def self.amount_for(field)
    {
      fifty_pound_note_pounds: 50,
      twenty_pound_note_pounds: 20,
      ten_pound_note_pounds: 10,
      five_pound_note_pounds: 5,
      two_pound_coins_pounds: 2,
      one_pound_coins_pounds: 1,
      fifty_pence_coins_cents: 50,
      twenty_pence_coins_cents: 20,
      ten_pence_coins_cents: 10,
      five_pence_coins_cents: 5,
    }.fetch(field)
  end
end
