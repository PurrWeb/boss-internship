class ApiKeysController < ApplicationController
  def index
    authorize!(:view, :api_keys_page)

    venue_keys = Venue.all.map do |venue|
      [venue, ApiKey.boss.current_for(venue: venue)]
    end

    render locals: { venue_keys: venue_keys }
  end

  def destroy
    authorize!(:destroy, :api_keys)

    key = ApiKey.find(params[:id])

    key.state_machine.transition_to!(:deleted, requster_user_id: current_user)

    ApiAccessToken.revoke!(api_key: key)

    flash[:success] = 'Key revoked successfully'
    redirect_to api_keys_path
  end

  def create
    authorize!(:create, :api_keys)

    ApiKey.create!(
      venue: venue_from_params,
      user: current_user,
      key_type: ApiKey::BOSS_KEY_TYPE
    )

    flash[:success] = 'Key generation successful'
    redirect_to api_keys_path
  end

  private
  def venue_from_params
    Venue.find(params[:venue_id])
  end
end
