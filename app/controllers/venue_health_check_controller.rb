class VenueHealthCheckController < ApplicationController
  before_filter :set_new_layout
  before_filter :find_accessible_venues
  before_filter :find_venue
  before_filter :ensure_venue_exists, only: [:show]
  before_filter :ensure_questionnaire_exists, only: [:show]

  def index
    current_venue = @venue || current_user.default_venue
    questionnaire_exists = current_venue.questionnaires.last.present?
    questionnaire_responses = QuestionnaireResponse.all.paginate(page: params[:page], per_page: 20)

    render locals: {
      current_venue: current_venue,
      accessible_venues: @accessible_venues,
      questionnaire_exists: questionnaire_exists,
      questionnaire_responses: questionnaire_responses
    }
  end

  def show
    questionnaire = @venue.questionnaires.last
    questionnaire_questions = questionnaire.questionnaire_questions
    questionnaire_categories = questionnaire.questionnaire_categories
    questionnaire_areas = questionnaire.questionnaire_areas

    render locals: {
      questionnaire: questionnaire,
      questionnaire_questions: questionnaire_questions,
      questionnaire_categories: questionnaire_categories,
      questionnaire_areas: questionnaire_areas,
      venues: @accessible_venues,
      access_token: current_user.current_access_token || AccessToken.create_web!(user: current_user)
    }
  end

  def render_v2_layout?
    true
  end

  private

  def ensure_questionnaire_exists
    if @venue.questionnaires.last.blank?
      flash[:error] = "Questionnaire hasn't been created yet"
      redirect_to venue_health_check_index_path
    end
  end

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all.includes(:questionnaires)
  end

  def find_venue
    @venue = @accessible_venues.detect { |venue| venue.id == params[:venue_id].to_i }
  end

  def ensure_venue_exists
    if @venue.blank?
      flash[:error] = "Venue doesn't exist"
      redirect_to venue_health_check_index_path
    end
  end
end
