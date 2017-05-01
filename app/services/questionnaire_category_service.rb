class QuestionnaireCategoryService
  attr_reader :questionnaire, :categories, :questions, :answers, :response,
    :questionnaire_categories_questionnaire

  def initialize(params)
    @questionnaire = params.fetch(:questionnaire)
    @response = @questionnaire.questionnaire_responses.last
    @questions = @questionnaire.questionnaire_questions
    @categories = @questionnaire.questionnaire_categories
    @answers = @response.questionnaire_answers
    @questionnaire_categories_questionnaire = @questionnaire
      .questionnaire_categories_questionnaires
      .where(
        questionnaire: questionnaire,
        questionnaire_category: @categories
      )
  end

  def category_passed?(category)
    category_score(category) >= category_threshold(category)
  end

  def category_threshold(category)
    questionnaire_categories_questionnaire.where(
      questionnaire_category: category
    ).last.threshold_score
  end

  def category_score(category)
    category_questions = category_questions(category)
    category_answers = category_answers(category_questions)

    category_answers.map do |answer|
      score_for_answer(answer.question, answer)
    end.compact.sum
  end

  def total_category_score(category)
    category_questions = category_questions(category)
    category_answers = category_answers(category_questions)

    category_answers.map do |answer|
      maximum_alloted_score(answer.question)
    end.compact.sum
  end

  private

  def maximum_alloted_score(question)
    if question.is_a?(ScaledQuestion)
      question.end_value * question.scale_increment
    elsif question.is_a?(BinaryQuestion)
      question.score
    end
  end

  def score_for_answer(question, answer)
    if question.is_a?(ScaledQuestion)
      answer.value.to_s.to_i * question.scale_increment
    elsif question.is_a?(BinaryQuestion)
      answer.pass_value? ? question.score : 0
    end
  end

  def category_questions(category)
    questions.where(
      questionnaire_category: category
    )
  end

  def category_answers(category_questions)
    answers.where(
      question: category_questions
    )
  end
end
