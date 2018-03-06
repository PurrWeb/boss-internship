require 'will_paginate/array'

module Api
  module V1
    class MarketingTasksController < APIController
      before_action :web_token_authenticate!

      def index
        authorize! :view, :marketing_tasks_page

        marketing_task_filter = MarketingTaskFilter.new(current_user, params)
        marketing_tasks_query = marketing_task_filter.query(
          relation: MarketingTask.includes(:venue, :created_by_user, :disabled_by_user, :marketing_task_transitions, :assigned_to_user, :completed_by_user, :marketing_task_notes)
        )
        marketing_tasks = marketing_tasks_query.paginated(
          page: params[:page],
          tasks_per_page: 5
        )

        serialized_marketing_tasks = camelized_collection(
          marketing_tasks,
          Api::V1::MarketingTaskSerializer,
          { current_user: current_user },
          '**'
        )

        render json: {
          marketingTasks: serialized_marketing_tasks,
          page: params[:page],
          generalTaskCount: marketing_tasks_query.general_task_count,
          musicTaskCount: marketing_tasks_query.music_task_count,
          sportsTaskCount: marketing_tasks_query.sports_task_count,
          artworkTaskCount: marketing_tasks_query.artwork_task_count
        }
      end

      def show
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :view, marketing_task

        render json: marketing_task,
          serializer: Api::V1::MarketingTaskSerializer,
          key_transform: :camel_lower,
          scope: { current_user: current_user }
      end

      def update
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :update, marketing_task

        if marketing_task.update(marketing_task_update_params)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            key_transform: :camel_lower,
            scope: { current_user: current_user }
        else
          render_unprocessable_entity(marketing_task)
        end
      end

      def add_general
        general_task = GeneralTask.new(
          general_task_params.merge(created_by_user: current_user)
        )
        authorize! :create, general_task

        if general_task.save
          render json: general_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: general_task }
          )
        end
      end

      def edit_general
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :update, marketing_task

        if marketing_task.update(general_task_params)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: marketing_task }
          )
        end
      end

      def add_live_music
        live_music_task = MusicTask.new(
          live_music_task_params.merge(created_by_user: current_user)
        )
        authorize! :create, live_music_task

        if live_music_task.save
          render json: live_music_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: live_music_task }
          )
        end
      end

      def edit_live_music
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :update, marketing_task

        if marketing_task.update(live_music_task_params)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: marketing_task }
          )
        end
      end

      def add_sports
        sports_task = SportsTask.new(
          sports_task_params.merge(created_by_user: current_user)
        )
        authorize! :create, sports_task


        if sports_task.save
          render json: sports_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: sports_task }
          )
        end
      end

      def edit_sports
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :update, marketing_task

        if marketing_task.update(sports_task_params)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: @marketing_task }
          )
        end
      end

      def add_artwork
        authorize! :manage, ArtworkTask.new

        artwork = ArtworkTask.new(
          artwork_params.merge(created_by_user: current_user)
        )

        if artwork.save
          render json: artwork,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: artwork }
          )
        end
      end

      def edit_artwork
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :update, marketing_task

        if marketing_task.update(artwork_params)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: marketing_task }
          )
        end
      end

      def destroy
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :destroy, marketing_task

        if marketing_task.disable(current_user)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: marketing_task }
          )
        end
      end

      def restore
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :restore, marketing_task

        if marketing_task.restore(current_user)
          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: marketing_task }
          )
        end
      end

      def change_status
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :update_status, marketing_task

        state_transition = StateTransition.new({
          requester: current_user,
          state_machine: marketing_task.state_machine,
          transition_to: params[:status]
        })

        if state_transition.transition
          if params[:status] == 'completed'
            marketing_task.update(completed_at: Time.current, completed_by_user: current_user)
          else
            marketing_task.update(completed_at: nil, completed_by_user: nil)
          end

          render json: marketing_task,
            serializer: Api::V1::MarketingTaskSerializer,
            key_transform: :camel_lower,
            scope: { current_user: current_user },
            include: '**'
        else
          render json: state_transition.api_errors, status: :unprocessable_entity
        end
      end

      def assign_user
        marketing_task = MarketingTask.find(params.fetch(:id))
        authorize! :assign, marketing_task

        assign_to_user_service = AssignToUserService.new(current_user, marketing_task, assign_to_user_params)

        if assign_to_user_service.assign
          render json: marketing_task.reload,
            serializer: Api::V1::MarketingTaskSerializer,
            status: :created,
            key_transform: :camel_lower
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: assign_to_user_service }
          )
        end
      end

      def notes
        marketing_task = MarketingTask.find(params.fetch(:id))
        note = marketing_task.marketing_task_notes.new(marketing_task_notes_params.merge(creator_user: current_user))

        authorize! :create_note, marketing_task

        if note.save
          render json: note, serializer: Api::V1::MarketingTaskNoteSerializer, status: :created, key_transform: :camel_lower
        else
          render_unprocessable_entity(note)
        end
      end

      def page_number
        if params[:page].present?
          params[:page].to_i
        else
          1
        end
      end

      private

      def general_task_params
        params.permit(:title, :due_at, :venue_id, :description)
      end

      def live_music_task_params
        params.permit(:title, :due_at, :venue_id, :start_time, :facebook_announcement, days: [])
      end

      def sports_task_params
        params.permit(:title, :due_at, :venue_id, :start_time, :facebook_announcement, days: [])
      end

      def artwork_params
        params.permit(:title, :description, :size, :height_cm, :width_cm, :due_at, :venue_id, :facebook_cover_page, :facebook_booster, :facebook_announcement, :print, :quantity)
      end

      def marketing_task_create_params
        params.permit(:venue_id, :title, :description, :priority, :marketing_task_image_ids => [])
      end

      def marketing_task_update_params
        params.permit(:title, :description, :priority, :marketing_task_image_ids => [])
      end

      def assign_to_user_params
        params.permit(:assign_to_user_id, :assign_to_self)
      end

      def marketing_task_notes_params
        params.permit(:note)
      end
    end
  end
end
