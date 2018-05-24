class MaintenanceTask < ActiveRecord::Base
  # Plugins
  include Statesman::Adapters::ActiveRecordQueries
  include Disableable

  # Scopes
  scope :priority_order, -> { order('maintenance_tasks.priority DESC') }

  # Rails plugin
  LOW_PRIORITY_ENUM_VALUE = 0
  MEDIUM_PRIORITY_ENUM_VALUE = 1
  HIGH_PRIORITY_ENUM_VALUE = 2

  enum priority: [:low_priority, :medium_priority, :high_priority]

  #Lower value first by default
  PRIORITY_SORT_KEYS = {
    low_priority: 0,
    medium_priority: -1,
    high_priority: -2
  }

  # Associations
  belongs_to :venue
  belongs_to :creator_user, class_name: 'User'
  belongs_to :disabled_by_user, class_name: 'User'
  has_many :maintenance_task_transitions, autosave: false
  has_many :maintenance_task_images
  has_many :maintenance_task_notes

  # Validations
  validates :title, :description, :priority, presence: true

  accepts_nested_attributes_for :maintenance_task_images

  before_save :associate_uploads_to_maintenance_task_images

  # Statesman methods start
  def state_machine
    @state_machine ||= MaintenanceTaskStateMachine.new(
      self,
      transition_class: MaintenanceTaskTransition,
      association_name: :maintenance_task_transitions
    )
  end

  def priority_sort_key
    PRIORITY_SORT_KEYS.fetch(priority.to_sym)
  end

  def status_sort_key(sort_type:)
    MaintenanceTaskStateMachine.
      sort_keys(sort_type: sort_type).
      fetch(state_machine.current_state.to_sym)
  end

  def self.transition_class
    MaintenanceTaskTransition
  end

  private_class_method :initial_state
  def self.initial_state
    :pending
  end
  # Statesman methods end

  def associate_uploads_to_maintenance_task_images
    return if maintenance_task_image_ids.blank?

    image_uploads = MaintenanceTaskImage.where(id: maintenance_task_image_ids)

    return if image_uploads.blank?

    maintenance_task_images << image_uploads
  end

  private
  def associate_uploads_to_maintenance_task_images
    return if maintenance_task_image_ids.blank?

    image_uploads = MaintenanceTaskImage.where(id: maintenance_task_image_ids)

    return if image_uploads.blank?

    maintenance_task_images << image_uploads
  end
end
