module Api
  module IdScannerApp
    module V1
      class TestsController < IdScannerAppController
        def get
          render json: {}, status: 200
        end
      end
    end
  end
end
