class IdScannerKeysController < ApplicationController
  before_action :set_new_layout

  def index
    authorize! :view, :id_scanner_keys_page

    if !index_prerequisites_met
      return redirect_to(id_scanner_keys_path(index_redirect_params))
    end

    id_scanner_app_api_keys = IdScannerAppApiKey.all
    if filter_from_params == "active_only"
      id_scanner_app_api_keys = id_scanner_app_api_keys.active
    end
    id_scanner_app_api_keys = id_scanner_app_api_keys.
      paginate(
        page: params[:page],
        per_page: 15
      )

    render locals: {
      filter_type: filter_from_params,
      id_scanner_app_api_keys: id_scanner_app_api_keys,
    }
  end

  def new
    authorize! :view, :id_scanner_keys_page

    id_scanner_app_api_key = IdScannerAppApiKey.new

    render locals: {
      id_scanner_app_api_key: id_scanner_app_api_key
    }
  end

  def create
    authorize! :create, :id_scanner_app_api_keys

    id_scanner_app_api_key = IdScannerAppApiKey.new(
      creator: current_user,
      name: id_scanner_app_api_key_params.fetch(:name)
    )

    if id_scanner_app_api_key.save
      flash[:success] = 'Key Created'
      redirect_to action: :index
    else

      render action: :new, locals: { id_scanner_app_api_key: id_scanner_app_api_key }
    end
  end

  def disable
    id_scanner_app_api_key = IdScannerAppApiKey.find_by(id: params.fetch(:id))

    authorize!(:disable, id_scanner_app_api_key)

    id_scanner_app_api_key.update_attributes!(
      disabled_at: Time.current,
      disabled_by_user: current_user,
    )

    flash[:success] = "Key Disabled Successfully"
    redirect_to action: :index
  end

  def id_scanner_app_api_key_params
    params.fetch(:id_scanner_app_api_key)
  end

  def index_redirect_params
    {
      filter: 'show_all'
    }
  end

  def index_prerequisites_met
    filter_from_params.present?
  end

  def filter_from_params
    if params[:filter].present?
      params[:filter] if valid_filters.include?(params[:filter])
    end
  end

  def valid_filters
    ["show_all", 'active_only']
  end
end
