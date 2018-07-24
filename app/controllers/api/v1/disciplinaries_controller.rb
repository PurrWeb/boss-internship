module Api
  module V1
    class DisciplinariesController < APIController
      before_filter :web_token_authenticate!

      def create
        authorize!(:create, :disciplinary)

        result = CreateDisciplinaryApiService.new(
          requester: current_user,
          staff_member: staff_member_from_params,
        ).call(params: {
          title: params.fetch(:title),
          level: params.fetch(:level),
          note: params.fetch(:note)
        })

        if result.success?
          render(
            json: result.disciplinary,
            serializer: Api::V1::StaffMemberProfile::DisciplinarySerializer,
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      def destroy
        authorize!(:disable, :disciplinary)

        result = DisableDisciplinaryApiService.new(
          requester: current_user,
          disciplinary: disciplinary_from_params,
        ).call

        if result.success?
          render(
            json: result.disciplinary,
            serializer: Api::V1::StaffMemberProfile::DisciplinarySerializer,
            status: 200
          )
        else
          render json: { errors: result.api_errors.errors}, status: 422
        end
      end

      def staff_member_from_params
        StaffMember.enabled.find_by(id: params.fetch(:staff_member_id))
      end

      def disciplinary_from_params
        staff_member_from_params.disciplinaries.find_by(id: params.fetch(:id))
      end
    end
  end
end
