module Api
  module IdScannerApp
    module V1
      class HistoryController < IdScannerAppController
        def index
          now = Time.current
          rota_shift_date = RotaShiftDate.new(now)

          scan_attempts = InRangeQuery.new(
            relation: IdScannerScanAttempt.all,
            start_value: rota_shift_date.start_time,
            end_value: rota_shift_date.end_time,
            start_column_name: 'created_at',
            end_column_name: 'created_at',
            include_boundaries: [:start],
          ).all

          render(
            json: {
              items: ActiveModel::Serializer::CollectionSerializer.new(
                scan_attempts,
                serializer: Api::IdScannerApp::V1::IdScannerScanAttemptSerialiser
              )
            }
          )
        end
      end
    end
  end
end
