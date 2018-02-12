class VenueHealthCheckController < ApplicationController
  before_filter :set_new_layout
  before_filter :find_accessible_venues

  def index
    unless params[:venue_id].present?
      return redirect_to(venue_health_check_index_path(index_redirect_params))
    end
    venue_from_params = @accessible_venues.detect { |venue| venue.id == params[:venue_id].to_i }
    venue = venue_from_params || current_venue
    authorize! :view, VenueHealthChecksPage.new(venue: venue)

    questionnaire_exists = current_venue.questionnaires.last.present?
    questionnaire_responses = QuestionnaireResponse.
      where(
        venue: venue
      ).
      includes(
        [:user, :questionnaire]
      ).
      order(created_at: :desc).
      paginate(
        page: params[:page], per_page: 20
      )

    render locals: {
      current_venue: venue,
      accessible_venues: @accessible_venues,
      questionnaire_exists: questionnaire_exists,
      questionnaire_responses: questionnaire_responses
    }
  end

  def new
    venue = Venue.find(params[:venue_id])
    authorize! :create, QuestionnaireResponse.new(venue: venue)
    questionnaire = venue.questionnaires.last

    if questionnaire.present?
      questionnaire_questions = questionnaire.questionnaire_questions
      questionnaire_categories = questionnaire.questionnaire_categories
      questionnaire_areas = questionnaire.questionnaire_areas

      render locals: {
        venue: venue,
        questionnaire: questionnaire,
        questionnaire_questions: questionnaire_questions,
        questionnaire_categories: questionnaire_categories,
        questionnaire_areas: questionnaire_areas,
        venues: @accessible_venues,
        access_token: current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
      }
    else
      flash[:error] = "Questionnaire hasn't been created yet"
      redirect_to venue_health_check_index_path
    end
  end

  def render_v2_layout?
    true
  end

  private
  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all.includes(:questionnaires)
  end

  def index_redirect_params
    venue = current_venue
    {
      venue_id: venue.andand.id,
    }
  end
end
