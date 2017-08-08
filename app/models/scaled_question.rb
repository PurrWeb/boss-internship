class ScaledQuestion < QuestionnaireQuestion
  validates :score, :scale_increment, :start_value, :end_value, presence: true
  validates :start_value, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: :end_value }
end
