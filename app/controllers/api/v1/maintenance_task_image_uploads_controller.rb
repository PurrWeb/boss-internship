module Api
  module V1
    class MaintenanceTaskImageUploadsController < APIController
      protect_from_forgery with: :null_session
      before_filter :web_token_authenticate!

      def create
        upload = MaintenanceTaskImage.new(file: create_params.fetch(:file))

        if upload.save
          render json: upload, status: :created, serializer: Api::V1::UploadSerializer
        else
          render json: upload,
            serializer: ActiveModel::Serializer::ErrorSerializer,
            status: :unprocessable_entity
        end
      end

      def destroy
        image = MaintenanceTaskImage.find_by(id: params[:id])

        if image.destroy
          render json: {}, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      private

      def create_params
        params.require(:upload).permit(:file)
      end
    end
  end
end
