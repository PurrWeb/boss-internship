class ArtworkTask < MarketingTask
  # Constants
  OTHER = 'other'.freeze

  # Validations
  validates :size, presence: true
  validates :height_cm, :width_cm, presence: true, if: Proc.new { |a| a.size == OTHER }
  validates :quantity, presence: true, if: Proc.new { |m| m.print? }

  # Callbacks
  before_validation :clear_size_dimensions

  private

  def clear_size_dimensions
    return if size == OTHER

    self.height_cm = nil
    self.width_cm = nil
  end
end
