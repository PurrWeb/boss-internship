module Api
  module ClockingApp
    module V1
      class InitController < ClockingAppController
        skip_before_filter :parse_access_tokens

        def index
          api_key = venue_api_key_from_params

          if api_key.present?
            current_venue = api_key.venue
            current_rota_date = RotaShiftDate.to_rota_date(Time.current);

            staff_types = StaffType.all

            rota = Rota.find_or_initialize_by(
              venue: current_venue,
              date: current_rota_date
            )

            rota_shifts = rota.rota_shifts.enabled.includes(:staff_member)

            staff_members = ClockableStaffMembersQuery.new(
              venue: current_venue,
              rota_shifts: rota_shifts
            ).all.includes([:master_venue, :staff_type, :name, :work_venues])

            clock_in_days = ClockInDay.where(
              staff_member: staff_members,
              venue: current_venue,
              date: current_rota_date
            ).includes([
              :venue, :staff_member, :clock_in_notes,
              :hours_acceptance_periods, :clock_in_periods
            ])

            clock_in_notes = ClockInNote.where(
              clock_in_day_id: clock_in_days
            )

            clock_in_periods = ClockInPeriod.where(
              clock_in_day: clock_in_days
            )

            clock_in_events = ClockInEvent.where(
              clock_in_period: clock_in_periods
            )

            render json: {
              clockInEvents: ActiveModel::Serializer::CollectionSerializer.new(
                clock_in_events,
                serializer: Api::ClockingApp::V1::ClockInEventSerializer,
              ),
              clockInNotes: ActiveModel::Serializer::CollectionSerializer.new(
                clock_in_notes,
                serializer: Api::ClockingApp::V1::ClockInNoteSerializer,
              ),
              rotaShifts: ActiveModel::Serializer::CollectionSerializer.new(
                rota_shifts,
                serializer: Api::ClockingApp::V1::RotaShiftSerializer,
              ),
              staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
                staff_members,
                serializer: Api::ClockingApp::V1::StaffMemberSerializer,
              ),
              staffTypes: ActiveModel::Serializer::CollectionSerializer.new(
                staff_types,
                serializer: Api::ClockingApp::V1::StaffTypeSerializer,
              ),
              appData: {
                currentVenueId: current_venue.id,
              },
              venues: ActiveModel::Serializer::CollectionSerializer.new(
                Venue.all,
                serializer: Api::ClockingApp::V1::VenueSerializer,
              )
            }, status: :ok
          else
            render json: {errors: {apiKey: 'API Key Invalid'}}, status: :unauthorized
          end
        end

        private
        def venue_api_key_from_params
          ApiKey.boss.active.find_by(key: params.fetch(:apiKey))
        end
      end
    end
  end
end
