module Api
  module ClockingApp
    module V1
      class NotesController < ClockingAppController

        def create
          authorize! :add_note, staff_member_from_token
          result = ClockingNoteApiService.new(
            requester: staff_member_from_token,
            clocking_note: ClockInNote.new
          ).create(params: {
            venue: venue_from_api_key,
            date: RotaShiftDate.to_rota_date(Time.now),
            staff_member: staff_member_from_params,
            note: params.fetch(:clockingNote),
          })

          if result.success?
            render json: { clockingNote: Api::ClockingApp::V1::ClockInNoteSerializer.new(result.clocking_note) }, status: 200
          else
            render json: { errors: result.api_errors.errors }, status: 422
          end
        end

        def update
          authorize! :edit_note, staff_member_from_token

          result = ClockingNoteApiService.new(
            requester: staff_member_from_token,
            clocking_note: note_from_params
          ).update(note: params.fetch(:noteText))

          if result.success?
            render json: { clockingNote: Api::ClockingApp::V1::ClockInNoteSerializer.new(result.clocking_note) }, status: 200
          else
            render json: { errors: result.api_errors.errors }, status: 422
          end
        end

        private

        def staff_member_from_params
          StaffMember.find_by(id: params[:staffMemberId])
        end

        def note_from_params
          ClockInNote.find_by(id: params.fetch(:id))
        end
      end
    end
  end
end
