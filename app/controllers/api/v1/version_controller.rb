module Api
  module V1
    class VersionController < ActionController::Base
      def version
        render(
          json: {version: ApplicationVersion.version},
          status: :ok
        )
      end
    end
  end
end