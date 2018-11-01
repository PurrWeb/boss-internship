module Api
  module V1
    class AccessoriesController < APIController
      before_filter :web_token_authenticate!

      def index
        authorize!(:view, :accessories_page)

        per_page = 5

        accessories = AccessoriesIndexQuery.new(
          venue: venue_from_params,
          filter: accessories_filter_params
        ).all.order(created_at: :desc)

        paginated_accessories = accessories.paginate(
          page: page_from_params,
          per_page: per_page
        )

        ids = paginated_accessories.map(&:id)

        staff_members = StaffMember.joins(accessory_requests: :accessory).where(accessories: {id: ids})

        accessories_history = AccessoryRestock
          .where(accessory_id: ids)

        render(
          json: paginated_accessories,
          meta: {
            history: ActiveModel::Serializer::CollectionSerializer.new(
              accessories_history,
              serializer: Api::V1::Accessories::AccessoryRestockSerializer,
            ),
            staffMembers: ActiveModel::Serializer::CollectionSerializer.new(
              staff_members,
              serializer: Api::V1::Accessories::StaffMemberSerializer,
            ),
            pageNumber: page_from_params,
            perPage: per_page,
            totalCount: accessories.count,
            totalPages: (accessories.count / per_page) + 1,
          },
          adapter: :json,
          meta_key: "pagination",
          each_serializer: Api::V1::Accessories::AccessorySerializer,
          key_transform: :camel_lower,
          status: 200
        )
      end

      def create
        authorize!(:create, :accessory)

        result = AccessoriesApiService.new(
          requester: current_user,
          accessory: Accessory.new(venue: venue_from_params)
        ).create(params: accessory_params)

        if result.success?
          render(
            json: result.accessory,
            serializer: Api::V1::Accessories::AccessorySerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update
        authorize!(:edit, :accessory)

        result = AccessoriesApiService.new(
          requester: current_user,
          accessory: venue_from_params.accessories.enabled.find_by(id: params.fetch(:id))
        ).update(params: accessory_params)

        if result.success?
          render(
            json: result.accessory,
            serializer: Api::V1::Accessories::AccessorySerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def update_free_items
        authorize!(:accessory_inventory, :accessory)

        result = AccessoriesApiService.new(
          requester: current_user,
          accessory: venue_from_params.accessories.enabled.find_by(id: params.fetch(:id))
        ).update_free_items(count: free_items_count_from_params)

        if result.success?
          accessories_history = result.accessory.accessory_restocks

          render(
            json: {
              accessory: Api::V1::Accessories::AccessorySerializer.new(result.accessory),
              history: ActiveModel::Serializer::CollectionSerializer.new(
                accessories_history,
                serializer: Api::V1::Accessories::AccessoryRestockSerializer,
              )
            },
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def destroy
        authorize!(:destroy, :accessory)

        result = AccessoriesApiService.new(
          requester: current_user,
          accessory: venue_from_params.accessories.enabled.find_by(id: params.fetch(:id))
        ).disable

        if result.success?
          render(
            json: result.accessory,
            serializer: Api::V1::Accessories::AccessorySerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      def restore
        authorize!(:enable, :accessory)

        result = AccessoriesApiService.new(
          requester: current_user,
          accessory: venue_from_params.accessories.disabled.find_by(id: params.fetch(:id))
        ).restore

        if result.success?
          render(
            json: result.accessory,
            serializer: Api::V1::Accessories::AccessorySerializer,
            key_transform: :camel_lower,
            status: 200
          )
        else
          render json: {errors: result.api_errors.errors}, status: 422
        end
      end

      private
      def free_items_count_from_params
        params.fetch(:freeItemsCount)
      end

      def accessories_filter_params
        params.permit(:accessoryType, :status, :name, :userRequestable, :page)
      end

      def accessory_params
        {
          name: params.fetch(:name),
          size: params.fetch(:size),
          accessory_type: params.fetch(:accessoryType),
          price_cents: params.fetch(:priceCents),
          user_requestable: params.fetch(:userRequestable)
        }
      end

      def page_from_params
        params[:page].to_i || 1
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params.fetch("venueId"))
      end
    end
  end
end
