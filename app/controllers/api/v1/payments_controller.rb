require 'csv'

module Api
  module V1
    class PaymentsController < APIController
      before_action :web_token_authenticate!

      def upload_csv
        authorize!(:upload, :payment_csv)

        parse_result = ParsePaymentUploadCSV.new(
          requester: current_user,
          csv_data: params.fetch("stringData")
        ).call

        if parse_result.success?
          process_data = ProcessPaymentsUpload.new(
            requester: current_user,
            parsed_upload: parse_result.data
          ).call

          render json: process_data, serializer: Api::V1::PaymentCsvProcessResultSerializer, status: 200
        else
          render json: parse_result.data, serializer: Api::V1::PaymentCsvParseResultSerializer, status: 200
        end
      end
    end
  end
end
