module Wtl
  class VerifyController < ApplicationController
    before_action :set_new_layout
    skip_before_filter :authenticate_user!
    skip_before_filter :set_paper_trail_whodunnit

    def user_for_paper_trail
      {}.to_json
    end

    def verify
      verification_token = params.fetch("verificationToken")
      wtl_client = WtlClient.find_by(verification_token: verification_token)
      # if !wtl_client.present?
      #   return redirect_to wtl_something_went_wrong_path(message: "There was an issue with your validation token.")
      # end
      # if wtl_client.verified?
      #   return redirect_to wtl_something_went_wrong_path(message: "This verification link has already been used. Your card is ready to use.")
      # end
      # if wtl_client.disabled?
      #   return redirect_to wtl_something_went_wrong_path(message: "We were unable to verify this email address due to an issue with your account.")
      # end
      # if wtl_client.wtl_card.present? && wtl_client.wtl_card.disabled?
      #   return redirect_to wtl_something_went_wrong_path(message: "We were unable to verify this email address due to an issue with your account.")
      # end

      wtl_client.verify!

      render(
        locals: {},
      )
    end

    def something_went_wrong
      render(
        locals: {message: params.fetch("message")},
      )
    end

    # disables naviation in layout
    def render_navigation?
      false
    end
  end
end
