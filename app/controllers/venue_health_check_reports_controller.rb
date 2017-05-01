class VenueHealthCheckReportsController < ApplicationController
  before_filter :find_accessible_venues
  before_filter :find_venue, only: [:show]

  def show
    questionnaire = Questionnaire.last
    questionnaire_questions = questionnaire.questionnaire_questions
    questionnaire_categories = questionnaire.questionnaire_categories
    questionnaire_answers = questionnaire.questionnaire_responses.last
      .questionnaire_answers.includes(:question)

    render locals: {
      questionnaire: questionnaire,
      questionnaire_questions: questionnaire_questions,
      questionnaire_categories: questionnaire_categories,
      questionnaire_answers: questionnaire_answers,
      venues: @accessible_venues,
      access_token: current_user.current_access_token || AccessToken.create_web!(user: current_user)
    }
  end

  private

  def render_v2_layout?
    true
  end

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
  end

  def find_venue
    @venue = @accessible_venues.detect { |venue| venue.name == params[:venue_health_check_id] }
  end
end
