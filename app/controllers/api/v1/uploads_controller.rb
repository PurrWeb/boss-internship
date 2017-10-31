module Api
  module V1
    class UploadsController < APIController
      protect_from_forgery with: :null_session
      before_filter :web_token_authenticate!

      def create
        upload = Upload.new(file: create_params.fetch(:file))
        if upload.save
          render json: upload, serializer: UploadSerializer, status: :created
        else
          render json: upload.errors.messages,
            status: :unprocessable_entity
        end
      end

      private

      def create_params
        params.require(:upload).permit(:file)
      end
    end
  end
end
