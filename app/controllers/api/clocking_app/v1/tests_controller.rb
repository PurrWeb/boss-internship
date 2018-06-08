module Api
  module ClockingApp
    module V1
      class TestsController < ClockingAppController
        skip_before_filter :parse_access_tokens

        def get
          ClockingAppAblyService.new.send_data_to_channel
          render json: {}, status: 200
        end
      end
    end
  end
end
