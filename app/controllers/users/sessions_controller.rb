class Users::SessionsController < Devise::SessionsController
  before_filter :set_new_layout
  # before_filter :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  def destroy
    WebApiAccessToken.revoke!(user: current_user)
    super
  end

  # protected

  # You can put the params you want to permit in the empty array.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end

  def set_new_layout
    @current_layout = 'newLayout';
  end

  def setup_frontend_bundles
    @frontend_bundles = SourcemapHelper.bundles
  end
end
