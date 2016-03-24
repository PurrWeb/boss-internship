class ChangeOrder < ActiveRecord::Base
  belongs_to :venue

  validates :date, presence: true
  validates :venue, presence: true
  validates :five_pound_notes, presence: true
  validates :one_pound_coins, presence: true
  validates :fifty_pence_coins, presence: true
  validates :twenty_pence_coins, presence: true
  validates :ten_pence_coins, presence: true
  validates :five_pence_coins, presence: true

  def self.build_default(venue:, date:)
    new(
      venue: venue,
      date: date,
      five_pound_notes:   0,
      one_pound_coins:    0,
      fifty_pence_coins:  0,
      twenty_pence_coins: 0,
      ten_pence_coins:    0,
      five_pence_coins:   0
    )
  end

  def submission_deadline
    RotaWeek.new(date + 1.week).
      start_date.
      beginning_of_day + 8.hours
  end

  def submission_deadline_past?(now: Time.now)
    now > submission_deadline
  end

  def editable?
    submission_deadline_past?
  end
end
