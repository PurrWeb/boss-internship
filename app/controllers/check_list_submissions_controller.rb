class CheckListSubmissionsController < ApplicationController
  before_filter :check_venue
  before_filter :set_new_layout

  def index
    authorize! :view, :check_list_submissions_page

    result = ChecklistSubmissionsIndexFilter.new(user: current_user, params: params)
    query = result.checklist_submissions_index_query
    submissions = query
      .all
      .order(created_at: :desc)
      .includes(:check_list_submission_answers)
      .includes({user: :name})

    submissions_page_data = ChecklistSubmissionsPageData.new(submissions: submissions, params: params)
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    accessible_venues = AccessibleVenuesQuery.new(current_user).all

    render locals: {
      access_token: access_token,
      current_venue: Api::V1::VenueForSelectSerializer.new(venue_from_params),
      venues:  ActiveModel::Serializer::CollectionSerializer.new(accessible_venues, serializer: Api::V1::VenueForSelectSerializer),
    }.merge(submissions_page_data.get_data)
  end

  private
  def check_venue
    unless venue_from_params.present?
      redirect_to(check_list_submissions_path(index_redirect_params))
    end
  end

  def index_redirect_params
    {
      venue_id: current_venue.id
    }
  end

  def venue_params
    params.permit(:venue_id)
  end

  def venue_from_params
    if current_user.has_all_venue_access?
      Venue.find_by({id: venue_params[:venue_id]})
    else
      current_user.venues.find_by(id: venue_params[:venue_id])
    end
  end
end
