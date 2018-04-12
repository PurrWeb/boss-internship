module Api
  module V1
    class SecurityRotaOverviewController < APIController
      before_filter :web_token_authenticate!

      def show
        if required_rota_overview_day_fields_present?
          date = date_from_params
          rotas = Rota.where(
            date: date,
          )
          staff_types = StaffType.where(role: 'security')
          staff_members = StaffMember
            .joins(:staff_type)
            .merge(staff_types)
            .includes(:staff_type)
            .includes(:name)
            .includes(:master_venue)
          rota_shifts = RotaShift
            .enabled
            .joins(:rota)
            .merge(rotas)
            .joins(:staff_member)
            .merge(staff_members)
            .includes(:rota)

          render json: {
            date: UIRotaDate.format(date),
            rotas: ActiveModel::Serializer::CollectionSerializer.new(
              rotas,
              serializer: Api::V1::SecurityRota::RotaSerializer,
            ),
            rotaShifts: ActiveModel::Serializer::CollectionSerializer.new(
              rota_shifts,
              serializer: Api::V1::SecurityRota::RotaShiftSerializer,
            ),
          }, status: 200
        else
          render json: { }, status: 422
        end
      end

      private
      def date_from_params
        if params[:id].present?
          UIRotaDate.parse(params[:id])
        end
      end

      def accessible_venues_for(user)
        AccessibleVenuesQuery.new(user).all
      end

      def required_security_rota_overview_day_fields
        ["id"]
      end

      def required_rota_overview_day_fields_present?
        required_security_rota_overview_day_fields.all? do |field|
          params.keys.include?(field)
        end
      end
    end
  end
end
