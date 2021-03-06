module Api
  module V1
    class CheckListsController < APIController
      before_filter :web_token_authenticate!
      before_filter :check_venue

      def index
        authorize!(:view, :check_lists_page)

        check_lists = venue_from_params
          .check_lists
          .includes(:check_list_items)

        access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

        render json: {
          checklists: ActiveModel::Serializer::CollectionSerializer.new(check_lists, serializer: CheckListSerializer),
          access_token: access_token,
          current_venue: Api::V1::VenueForSelectSerializer.new(venue_from_params),
          venues: ActiveModel::Serializer::CollectionSerializer.new(Venue.all, serializer: Api::V1::VenueForSelectSerializer)
        }
      end

      def create
        authorize!(:create, :check_lists)

        check_list_items = checklist_params[:check_list_items] || []
        check_list = CheckList.new({
          name: checklist_params[:name],
          venue: venue_from_params
        })
        check_list.check_list_items.build(check_list_items.map{|item| {description: item}})
        check_list.save
        if check_list.valid?
          render json: {check_list: CheckListSerializer.new(check_list)}, status: :ok
        else
          render(
            'errors',
            locals: {
              checklist: check_list,
            },
            status: :unprocessable_entity
          )
        end
      end

      def update
        authorize!(:create, :check_lists)

        check_list = venue_from_params.check_lists.find(params[:id])
        check_list_items = checklist_params[:check_list_items] || []

        check_list.name = checklist_params[:name]

        check_list.check_list_items.destroy_all
        check_list.check_list_items.create(check_list_items.map{|item| {description: item}})
        check_list.save

        if check_list.valid?
          render json: {check_list: CheckListSerializer.new(check_list)}, status: :ok
        else
          render(
            'errors',
            locals: {
              checklist: check_list,
            },
            status: :unprocessable_entity
          )
        end
      end

      def destroy
        authorize!(:destroy, :check_lists)

        check_list = venue_from_params.check_lists.find(params[:id])
        if check_list.present?
          check_list.destroy
          render json: {}, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      def submit
        authorize!(:submit, :check_lists)

        check_list_items = submit_checklist_params.fetch(:items)
        check_list_submission = CheckListSubmission.new({
          user: current_user,
          venue: Venue.find(submit_checklist_params.fetch(:venue_id)),
          name: submit_checklist_params.fetch(:name)
        })

        check_list_submission.check_list_submission_answers.build(check_list_items)
        check_list_submission.save
        if check_list_submission.valid?
          render json: {}, status: :ok
        else
          render(
            'errors',
            locals: {
              checklist: check_list_submission,
            },
            status: :unprocessable_entity
          )
        end
      end

      private

      def check_venue
        unless venue_from_params.present?
          render json: {}, status: :unprocessable_entity
        end
      end

      def checklist_params
        params.require(:check_list).permit(:name, :venue_id, check_list_items: [])
      end

      def submit_checklist_params
        params.require(:check_list).permit(:id, :venue_id, :name, items: [:description, :answer, :note])
      end

      def venue_params
        params.permit(:venue_id)
      end

      def venue_from_params
        if current_user.has_all_venue_access?
          Venue.find_by({id: venue_params.fetch(:venue_id)})
        else
          current_user.venues.find(venue_params.fetch(:venue_id))
        end
      end
    end
  end
end
