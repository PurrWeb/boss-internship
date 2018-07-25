module Api
  module V1
    class DisciplinariesController < APIController
      before_filter :web_token_authenticate!

      def index
        authorize!(:view, :disciplinaries_page)

        filtered_disciplinaries = DisciplinariesIndexQuery.new(
          staff_member: staff_member_from_params,
          filter: filter_from_params
        ).all

        render(
          json: {
            disciplinaries: ActiveModel::Serializer::CollectionSerializer.new(
              filtered_disciplinaries,
              serializer: Api::V1::StaffMemberProfile::DisciplinarySerializer,
            ),
            filter: filter_from_params
          },
          status: 200
        )
      end

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

      def filter_from_params
        parced_start_date = UIRotaDate.parse_if_present(params[:start_date])
        parced_end_date = UIRotaDate.parse_if_present(params[:end_date])
        start_date = nil
        end_date = nil

        if parced_start_date.present? && parced_end_date.present? && parced_start_date <= parced_end_date
          start_date = parced_start_date
          end_date = parced_end_date
        end
        {
          start_date: start_date,
          end_date: end_date,
          show_expired: params[:show].kind_of?(Array) && params[:show].include?('expired'),
          show_disabled: params[:show].kind_of?(Array) && params[:show].include?('disabled'),
        }
      end
    end
  end
end
