module Api
  module SecurityApp
    module V1
      class InitController < SecurityAppController
        before_action :security_app_api_token_athenticate!

        def index
          staff_member = current_staff_member

          authorize! :access, :security_app

          render json: {
            profilePage: {
              staffMemberId: staff_member.id,
              staffMember: Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
            },
            shiftsPage: {
              staffMemberId: staff_member.id,
              rotaShifts: ActiveModel::Serializer::CollectionSerializer.new(
                staff_member.rota_shifts.enabled.includes(:rota),
                serializer: Api::SecurityApp::V1::RotaShiftSerializer
              ),
              venues: ActiveModel::Serializer::CollectionSerializer.new(Venue.all, serializer: Api::SecurityApp::V1::VenueSerializer)
            }
          }, status: 200
        end
      end
    end
  end
end