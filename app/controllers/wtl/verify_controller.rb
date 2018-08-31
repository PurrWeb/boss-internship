module Wtl
  class VerifyController < ApplicationController
    before_action :set_new_layout
    skip_before_filter :authenticate_user!

    def verify
      verification_token = params.fetch('verificationToken')
      wtl_client = WtlClient.find_by(verification_token: verification_token)
      if !wtl_client.present?
        return redirect_to wtl_something_went_wrong_path(message: 'There was an issue with your validation token.')
      end
      if wtl_client.verified?
        return redirect_to wtl_something_went_wrong_path(message: 'This account has already been verified.')
      end

      wtl_client.verify!

      render(
        locals: {}
      )
    end

    def something_went_wrong
      render(
        locals: { message: params.fetch("message") }
      )
    end

    # disables naviation in layout
    def render_navigation?
      false
    end
  end
end
