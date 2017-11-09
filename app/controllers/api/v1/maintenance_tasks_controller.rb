require 'will_paginate/array'

module Api
  module V1
    class MaintenanceTasksController < APIController
      before_action :web_token_authenticate!
      before_action :find_venue!, except: [:index]
      before_action :find_maintenance_task!, except: [:create, :index]

      def index
        maintenance_tasks_filter = MaintenanceTaskFilter.new(params).fetch
        maintenance_tasks = maintenance_tasks_filter.paginate(
          page: page_number,
          per_page: 10
        )

        serialized_maintenance_tasks = camelized_collection(
          maintenance_tasks,
          Api::V1::MaintenanceTaskSerializer,
          { current_user: current_user },
          '**'
        )

        render json: {
          pageNumber: page_number,
          perPage: 10,
          totalCount: maintenance_tasks_filter.count,
          totalPages: (maintenance_tasks_filter.count / 10) + 1,
          maintenanceTasks: serialized_maintenance_tasks
        }
      end

      def show
        authorize! :view, @maintenance_task

        render json: @maintenance_task,
          serializer: Api::V1::MaintenanceTaskSerializer,
          key_transform: :camel_lower,
          scope: { current_user: current_user }
      end

      def update
        authorize! :manage, @maintenance_task

        if @maintenance_task.update(maintenance_task_update_params.merge(venue: @venue))
          render json: @maintenance_task,
            serializer: Api::V1::MaintenanceTaskSerializer,
            key_transform: :camel_lower,
            scope: { current_user: current_user }
        else
          render_unprocessable_entity(@maintenance_task)
        end
      end

      def create
        maintenance_task = MaintenanceTask.new(
          maintenance_task_create_params.merge(creator_user: current_user, venue: @venue)
        )

        authorize! :manage, maintenance_task

        if maintenance_task.save
          render json: maintenance_task,
            serializer: Api::V1::MaintenanceTaskSerializer,
            status: :created,
            key_transform: :camel_lower,
            scope: { current_user: current_user }
        else
          render_unprocessable_entity(maintenance_task)
        end
      end

      def destroy
        authorize! :manage, @maintenance_task

        if @maintenance_task.destroy
          render json: {}, status: :ok
        else
          render json: {}, status: :unprocessable_entity
        end
      end

      def change_status
        authorize! :manage, @maintenance_task

        state_transition = StateTransition.new({
          requester: current_user,
          state_machine: @maintenance_task.state_machine,
          transition_to: params[:status]
        })

        if state_transition.transition
          render json: @maintenance_task,
            serializer: Api::V1::MaintenanceTaskSerializer,
            key_transform: :camel_lower,
            scope: { current_user: current_user },
            include: '**'
        else
          render json: state_transition.api_errors, status: :unprocessable_entity
        end
      end

      def add_note
        note = @maintenance_task.maintenance_task_notes.new(maintenance_task_notes_params.merge(creator_user: current_user))

        authorize! :manage, @maintenance_task

        if note.save
          render json: note, serializer: Api::V1::MaintenanceTaskNoteSerializer, status: :created, key_transform: :camel_lower
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

      def maintenance_task_create_params
        params.permit(:venue_id, :title, :description, :priority, :maintenance_task_image_ids => [])
      end

      def maintenance_task_update_params
        params.permit(:title, :description, :priority, :maintenance_task_image_ids => [])
      end

      def maintenance_task_notes_params
        params.permit(:note)
      end

      def find_venue!
        @venue ||= Venue.find(params[:venue_id])
      end

      def find_maintenance_task!
        @maintenance_task ||= MaintenanceTask.find(params.fetch(:id))
      end
    end
  end
end
