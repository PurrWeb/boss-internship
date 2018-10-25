require 'csv'

module Api
  module V1
    class PaymentsController < APIController
      before_action :web_token_authenticate!

      def index
        staff_member = StaffMember.find(params[:staff_member_id])
        authorize!(:view_payments, staff_member)

        payments = StaffMemberPaymentsIndexQuery.new(
          staff_member: staff_member,
          start_date: index_filter_start_date_from_params,
          end_date: index_filter_end_date_from_params,
          status_filter: index_filter_status_filter_from_params
        ).
          all.
          includes([:created_by_user, staff_member: :name])

        render(
          {
            json: ActiveModel::Serializer::CollectionSerializer.new(
              payments,
              serializer: Api::V1::StaffMemberProfile::PaymentSerializer,
              scope: {ability: current_ability},
            ),
            status: 200
          }
        )
      end

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

      private
      def index_filter_start_date_from_params
        UIRotaDate.parse(params.fetch(:start_date))
      end

      def index_filter_end_date_from_params
        UIRotaDate.parse(params.fetch(:end_date))
      end

      def index_filter_status_filter_from_params
        value = params.fetch(:status_filter)

        if StaffMemberPaymentPageFilter::STATUS_FILTER_VALUES.include?(value)
          value
        else
          raise "supplied status filter value: #{value} invalid"
        end
      end
    end
  end
end
