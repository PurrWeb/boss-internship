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
  validate :shift_does_not_overlap_existing_shift

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

  # validation
  def shift_does_not_overlap_existing_shift
    if starts_at.present? && ends_at.present? && staff_member.present? && rota.present?
      query = ShiftInDateRangeQuery.new(
        rota: rota,
        staff_member: staff_member,
        starts_at: starts_at,
        ends_at:   ends_at
      ).all

      if persisted?
        query = query.where('id != ?', id)
      end

      if query.count > 0
        errors.add(:base, 'shift overlaps existing shift')
      end
    end
  end
end
