module Api
  module V1
    class QuestionnaireResponsesController < APIController
      skip_before_action :verify_authenticity_token
      before_filter :web_token_authenticate!

      def create
        questionnaire_response = QuestionnaireResponse.new(create_params.merge(user: current_user))

        if questionnaire_response.save
          render json: {}
        else
          render json: resource,
            serializer: ActiveModel::Serializer::ErrorSerializer,
            status: :unprocessable_entity
        end
      end

      private

      def create_params
        params.require(:response).permit(
          :questionnaire_id, questionnaire_answers_attributes: [:question_id, :value]
        )
      end
    end
  end
end
