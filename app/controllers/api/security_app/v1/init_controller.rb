module Api
  module SecurityApp
    module V1
      class InitController < SecurityAppController
        before_action :security_app_api_token_athenticate!

        def index
          staff_member = current_staff_member

          authorize! :access, current_mobile_app

          render json: {
            profilePage: {
              staffMemberId: staff_member.id,
              staffMember: Api::SecurityApp::V1::ProfileStaffMemberSerializer.new(staff_member)
            },
            shiftsPage: {
              staffMemberId: staff_member.id,
              rotaShifts: ActiveModel::Serializer::CollectionSerializer.new(
                PublishedRotaShiftQuery.new(staff_member: staff_member).all.includes(:rota),
                serializer: Api::SecurityApp::V1::RotaShiftSerializer
              ),
              securityVenueShifts: ActiveModel::Serializer::CollectionSerializer.new(
                SecurityVenueShift.enabled.where(staff_member: staff_member),
                serializer: Api::SecurityApp::V1::SecurityVenueShiftSerializer
              ),
              venues: ActiveModel::Serializer::CollectionSerializer.new(Venue.all, serializer: Api::SecurityApp::V1::VenueSerializer),
              securityVenues: ActiveModel::Serializer::CollectionSerializer.new(SecurityVenue.all, serializer: Api::SecurityApp::V1::VenueSerializer)
            },
            ablyData: {
              presenceChannelName: SecurityAppUpdateService.security_presence_channel,
              personalChannelName: SecurityAppUpdateService.personal_channel(id: staff_member.id)
            }
          }, status: 200
        end
      end
    end
  end
end
