module Api
  module V1
    class VouchersController < APIController
      before_filter :web_token_authenticate!

      def create
        venue = Venue.find(params[:venue_id])

        result = CreateVoucherApiService.new(
          venue: venue,
          requester: current_user
        ).call(
          description: params.fetch(:description)
        )

        if result.success?
          render json: result.voucher, status: 200
        else
          render 'api/v1/shared/api_errors.json', status: 422 ,locals: { api_errors: result.api_errors }
        end
      end

      def destroy
        voucher = Voucher.find(params.fetch(:id))

        deleted_voucher = DisableVoucher.new(
          voucher: voucher,
          requester: current_user
        ).call

        render json: deleted_voucher, status: 200
      end

      def redeem
        voucher = Voucher.find(params.fetch(:id))

        result = RedeemVoucher.new(
          voucher: voucher,
          requester: current_user
        ).call({
          staff_member_id: params.fetch("staffMemberId")
        })

        if result.success?
          render json: {}, status: 200
        else
          render 'api/v1/shared/api_errors.json', status: 422, locals: { api_errors: result.api_errors }
        end
      end
    end
  end
end
