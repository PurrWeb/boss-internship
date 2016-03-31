class ChangeOrder < ActiveRecord::Base
  belongs_to :venue

  validates :submission_deadline, presence: true
  validates :venue, presence: true
  validates :five_pound_notes, presence: true
  validates :one_pound_coins, presence: true
  validates :fifty_pence_coins, presence: true
  validates :twenty_pence_coins, presence: true
  validates :ten_pence_coins, presence: true
  validates :five_pence_coins, presence: true

  def self.build_default(venue:, submission_deadline:)
    new(
      venue: venue,
      submission_deadline: submission_deadline,
      five_pound_notes:   0,
      one_pound_coins:    0,
      fifty_pence_coins:  0,
      twenty_pence_coins: 0,
      ten_pence_coins:    0,
      five_pence_coins:   0
    )
  end

  def self.current
    now = Time.now.to_date
    this_week = RotaWeek.new(now)
    last_week = RotaWeek.new(now - 1.week)

    last_deadline = ChangeOrderSubmissionDeadline.new(
      week: last_week
    ).time

    this_deadline = ChangeOrderSubmissionDeadline.new(
      week: this_week
    ).time

    where("submission_deadline >=  ? AND submission_deadline <= ?", last_deadline, this_deadline)
  end

  def submission_deadline_past?(now: Time.now)
    now > submission_deadline
  end

  def editable?
    submission_deadline_past?
  end
end
