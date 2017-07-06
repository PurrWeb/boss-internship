class VenueHealthCheckReportsController < ApplicationController
  before_filter :set_new_layout
  before_filter :find_accessible_venues

  def show
    questionnaire_response = QuestionnaireResponse.
      includes([
        :venue,
        questionnaire: [
          questionnaire_categories: [:questionnaires],
          questionnaire_responses: [:questionnaire_answers]
        ]
      ]).
      find(params[:id])


    authorize! :view, questionnaire_response
    questionnaire = questionnaire_response.questionnaire
    questionnaire_questions = questionnaire.questionnaire_questions
    questionnaire_categories = questionnaire.questionnaire_categories
    questionnaire_answers = questionnaire_response.questionnaire_answers
      .includes(:questionnaire_question, :uploads)

    render locals: {
      venue: questionnaire_response.venue,
      questionnaire: questionnaire,
      questionnaire_response: questionnaire_response,
      questionnaire_questions: questionnaire_questions,
      questionnaire_categories: questionnaire_categories,
      questionnaire_answers: questionnaire_answers,
      venues: @accessible_venues,
      access_token: current_user.current_access_token || AccessToken.create_web!(user: current_user),
      user: questionnaire_response.user
    }
  end

  private
  def render_v2_layout?
    true
  end

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
  end
end
