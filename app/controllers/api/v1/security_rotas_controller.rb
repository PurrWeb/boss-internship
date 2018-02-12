module Api
  module V1
    class SecurityRotasController < APIController
      before_filter :web_token_authenticate!
      before_action :authorize

      def overview
        date = date_from_params
        week = RotaWeek.new(date)

        if date == week.start_date
           render locals: { week: week }
        else
          redirect_to overview_api_v1_security_rota_path(id: UIRotaDate.format(week.start_date))
        end
      end

      private
      def authorize
        authorize! :view, :security_rota
      end

      def date_from_params
        UIRotaDate.parse(params.fetch(:id))
      end
    end
  end
end
