module Api
  module IdScannerApp
    module V1
      class ScanController < IdScannerAppController
        def scan
          now = Time.current
          rota_shift_date = RotaShiftDate.new(now)
          guid = params.fetch(:guid)
          staff_member = StaffMember.find_by(id_scanner_guid: guid)

          if staff_member.present? && staff_member.disabled?
            render json: {}, status: 401
          elsif staff_member.present?
            all_successful_scan_attempts = IdScannerScanAttempt.where(
              status: IdScannerScanAttempt::SUCCESS_STATUS,
              api_key: current_api_key,
              guid: guid,
            )

            scan_already_exists = InRangeQuery.new(
              relation: all_successful_scan_attempts,
              start_value: rota_shift_date.start_time,
              end_value: rota_shift_date.end_time,
              start_column_name: 'created_at',
              end_column_name: 'created_at',
              include_boundaries: [:start],
            ).all.first.present?

            if scan_already_exists
              render json: {
                staffMember: Api::IdScannerApp::V1::StaffMemberSerializer.new(staff_member)
              }, status: 403
            else
              render json: {
                staffMember: Api::IdScannerApp::V1::StaffMemberSerializer.new(staff_member)
              }
            end
          else
            render json: {}, status: 401
          end
        end
      end
    end
  end
end
