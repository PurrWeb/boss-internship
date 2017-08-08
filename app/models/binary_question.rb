class BinaryQuestion < QuestionnaireQuestion
  validates :score, :pass_values, :fail_values, :possible_values, presence: true
end
