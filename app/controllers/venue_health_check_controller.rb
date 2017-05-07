class VenueHealthCheckController < ApplicationController
  before_filter :find_accessible_venues
  before_filter :find_venue, only: [:show]

  def index
    venue_id = params[:venue_id]

    if venue_id.present?
      venue = @accessible_venues.find_by(id: venue_id)
    else
      venue = @accessible_venues.last
    end

    # This action will automatically redirect to the last venue in the accessible_venues array
    # as a temporary solution until the venue page is ready.
    redirect_to venue_health_check_path(id: venue.name)
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

  def find_accessible_venues
    @accessible_venues = AccessibleVenuesQuery.new(current_user).all
  end

  def find_venue
    @venue = @accessible_venues.detect { |venue| venue.name == params[:id] }
  end
end
