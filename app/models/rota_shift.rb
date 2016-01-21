class RotaShift < ActiveRecord::Base
  include Enableable

  belongs_to :creator, class_name: "User"
  belongs_to :disabled_by_user, class_name: "User"
  belongs_to :staff_member
  belongs_to :rota

  validates :creator, presence: true
  validates :staff_member, presence: true
  validates :rota, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
  validate :times_in_correct_order
  validate :times_on_correct_day
  validate :times_in_fifteen_minute_increments

  private
  # validation
  def times_in_correct_order
    if starts_at.present? && ends_at.present?
      errors.add(:base, 'starts time must be after end time') if starts_at >= ends_at
    end
  end

  # validation
  def times_on_correct_day
    [:starts_at, :ends_at].each do |field|
      time = public_send(field)
      if time.present? && (time.to_date != rota.date.to_date)
        raise 'time suppiled on incorrect day'
      end
    end
  end

  # validation
  def times_in_fifteen_minute_increments
    [:starts_at, :ends_at].each do |field|
      time = public_send(field)
      if time.present?
        minute = Integer(time.strftime('%M'))
        if ![0, 15, 30 ,45].include?(minute)
          errors.add(field, 'must be 15 minute intervals')
        end
      end
    end
  end
end
