class ArtworkTask < MarketingTask
  A1_SIZE = 'a1'
  A2_SIZE = 'a2'
  A3_SIZE = 'a3'
  A4_SIZE = 'a4'
  A5_SIZE = 'a5'
  A6_SIZE = 'a6'
  OTHER_SIZE = 'other'
  SIZES = [
    A1_SIZE,
    A2_SIZE,
    A3_SIZE,
    A4_SIZE,
    A5_SIZE,
    A6_SIZE,
    OTHER_SIZE
  ]

  # Validations
  validates :size, inclusion: { in: SIZES, message: 'is required' }
  validates :height_cm, :width_cm, presence: true, if: Proc.new { |a| a.size == OTHER_SIZE }
  validates :quantity, presence: true, if: Proc.new { |m| m.print? }

  # Callbacks
  before_validation :clear_size_dimensions

  private

  def clear_size_dimensions
    return if size == OTHER_SIZE

    self.height_cm = nil
    self.width_cm = nil
  end
end
