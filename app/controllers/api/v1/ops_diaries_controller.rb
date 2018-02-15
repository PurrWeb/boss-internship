module Api
  module V1
    class OpsDiariesController < APIController
      before_filter :web_token_authenticate!

      def index
        authorize!(:view, :ops_diary)

        per_page = 2

        ops_diaries = OpsDiariesIndexQuery.new(
          filter: ops_diaries_filter_params
        ).all.order(created_at: :desc)

        paginated_diary = ops_diaries.limit(limit_from_params || per_page)
        totalCount = ops_diaries.size
        render(
          json: {
            venues: ActiveModel::Serializer::CollectionSerializer.new(accessible_venues, serializer: Api::V1::SimpleVenueSerializer),
            users: ActiveModel::Serializer::CollectionSerializer.new(User.includes(:name).all, serializer: Api::V1::SimpleUserSerializer),
            diaries: ActiveModel::Serializer::CollectionSerializer.new(paginated_diary, serializer: Api::V1::OpsDiaries::OpsDiarySerializer),
            page: {
              currentUserId: current_user.id,
              perPage: per_page,
              totalCount: totalCount
            }
          }
        )
      end

      def create
        authorize!(:create, :ops_diary)

        result = CreateOpsDiaryApiService.new(
          requester: current_user
        ).call(params: ops_diary_params)


        if result.success?
          render(
            json: result.ops_diary,
            serializer: Api::V1::OpsDiaries::OpsDiarySerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        authorize!(:update, :ops_diary)

        ops_diary = OpsDiary.active.find_by(id: params.fetch(:id));
        unless ops_diary.present?
          return render json: {}, status: 404
        end

        result = OpsDiaryApiService.new(
          requester: current_user,
          ops_diary: ops_diary,
          venue: ops_diary.venue
        ).update(params: ops_diary_params)

        if result.success?
          render(
            json: result.ops_diary,
            serializer: Api::V1::OpsDiaries::OpsDiarySerializer,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def disable
        authorize!(:disable, :ops_diary)

        ops_diary = OpsDiary.active.find_by(id: params.fetch(:id));
        unless ops_diary.present?
          return render json: {}, status: 404
        end

        result = OpsDiaryApiService.new(
          requester: current_user,
          ops_diary: ops_diary,
          venue: ops_diary.venue
        ).disable

        if result.success?
          render(
            json: result.ops_diary,
            serializer: Api::V1::OpsDiaries::OpsDiarySerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def enable
        authorize!(:enable, :ops_diary)

        ops_diary = OpsDiary.disabled.find_by(id: params.fetch(:id));
        unless ops_diary.present?
          return render json: {}, status: 404
        end

        result = OpsDiaryApiService.new(
          requester: current_user,
          ops_diary: ops_diary,
          venue: ops_diary.venue
        ).enable

        if result.success?
          render(
            json: result.ops_diary,
            serializer: Api::V1::OpsDiaries::OpsDiarySerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private
      def ops_diaries_filter_params
        params.permit(:status, :start_date, :end_date, priorities: [], venue_ids: [])
      end

      def limit_from_params
        params[:limit]
      end

      def ops_diary_params
        {
          title: params.fetch(:title),
          text: params.fetch(:text),
          priority: params.fetch(:priority),
          venueId: params.fetch(:venueId)
        }
      end

      def page_from_params
        params[:page].to_i || 1
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params.fetch("venue"))
      end
    end
  end
end
