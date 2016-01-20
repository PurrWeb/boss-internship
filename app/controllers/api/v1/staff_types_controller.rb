module Api
  module V1
    class StaffTypesController < APIController
      def show
        staff_type = StaffType.find(params.fetch(:id))
        render locals: { staff_type: staff_type }
      end
    end
  end
end
