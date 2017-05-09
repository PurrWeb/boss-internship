class VenueHealthCheckReportsController < ApplicationController
  before_filter :find_accessible_venues
  before_filter :find_venue, only: [:show]
  before_filter :ensure_venue_exists, only: [:show]
  before_filter :ensure_report_exists, only: [:show]

  def show
    questionnaire = @venue.questionnaires.last
    questionnaire_questions = questionnaire.questionnaire_questions
    questionnaire_categories = questionnaire.questionnaire_categories
    questionnaire_response = questionnaire.questionnaire_responses.last
    questionnaire_answers = questionnaire_response.questionnaire_answers
      .includes(:questionnaire_question, :uploads)

    render locals: {
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

  def ensure_report_exists
    questionnaire = @venue.questionnaires.last

    if questionnaire.blank? || questionnaire.questionnaire_responses.blank?
      render_not_found!
    end
  end

  def render_v2_layout?
    true
  end

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
  end

  def find_venue
    @venue = @accessible_venues.detect { |venue| venue.id == params[:venue_health_check_id].to_i }
  end

  def ensure_venue_exists
    if @venue.blank?
      render_not_found!
    end
  end
end
