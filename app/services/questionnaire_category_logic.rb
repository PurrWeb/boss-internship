class QuestionnaireCategoryLogic
  def initialize(questionnaire:, questionnaire_category:)
    raise 'incompatible questionnaire and categories supplied' unless questionnaire_category.questionnaires.include?(questionnaire)
    @questionnaire = questionnaire
    @category = questionnaire_category
    @questions = questionnaire.questionnaire_questions.where(questionnaire_category: category)
  end
  attr_reader :questionnaire, :category, :questions

  def pass?(response:)
    score = score(response: response)
    score_percentage = if posible_score == 0
      0
    else
      (score / posible_score) * 100
    end

    score_percentage >= threshold_percentage && required_questions_passed?(response: response)
  end

  def score(response:)
    answers = response.questionnaire_answers.where(questionnaire_question: questions).includes(:questionnaire_question)

    answers.map do |answer|
      answer_score(answer: answer)
    end.compact.sum
  end

  def threshold_percentage
    join_table_record = QuestionnaireCategoriesQuestionnaire.find_by(questionnaire_category: category, questionnaire: questionnaire)

    if join_table_record.present? && join_table_record.threshold_score.present?
      join_table_record.threshold_score
    else
      0
    end
  end

  def posible_score
    questions.map do |question|
      max_possible_score(question: question)
    end.compact.sum
  end

  def required_questions_passed?(response: response)
    required_questions = questions.required

    return true if required_questions.blank?

    required_question_answers = response.questionnaire_answers.where(questionnaire_question: required_questions)
    required_question_answers.map(&:pass_value?).exclude?(false)
  end

  private
  def answer_score(answer:)
    question = answer.questionnaire_question
    if question.is_a?(ScaledQuestion)
      answer.value.to_s.to_i * question.scale_increment
    elsif question.is_a?(BinaryQuestion)
      answer.pass_value? ? question.score : 0
    else
      0
    end
  end

  def max_possible_score(question:)
    if question.is_a?(ScaledQuestion)
      question.end_value * question.scale_increment
    elsif question.is_a?(BinaryQuestion)
      question.score
    else
      0
    end
  end
end
