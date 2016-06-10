class OldHour < ActiveRecord::Base
  validate :week_start_date_valid

  belongs_to :staff_member
  belongs_to :creator, class_name: 'User', foreign_key: :creator_user_id
  belongs_to :parent, class_name: 'OldHour', foreign_key: :parent_old_hour_id

  validates :minutes, numericality: { greater_than: 0 }
  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :note, presence: true

  def week_start_date_valid
    return unless week_start_date.present?
    if RotaWeek.new(week_start_date).start_date != week_start_date
      errors.add(:week_start_date, 'must be at start of week')
    end

    if RotaWeek.new(week_start_date).start_date < RotaWeek.new(Time.current).start_date
      errors.add(:base, 'Cannot create old hours for weeks in the past')
    end
  end

  def self.enabled
    where(disabled_at: nil)
  end

  def count
    if minutes.present?
      minutes / 60.0
    else
      0.0
    end
  end
end
