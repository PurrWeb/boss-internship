class MaintenanceTask < ActiveRecord::Base
  # Plugins
  include Statesman::Adapters::ActiveRecordQueries

  # Scopes
  scope :priority_order, -> { order('maintenance_tasks.priority DESC') }

  # Rails plugin
  LOW_PRIORITY_ENUM_VALUE = 0
  MEDIUM_PRIORITY_ENUM_VALUE = 1
  HIGH_PRIORITY_ENUM_VALUE = 2

  enum priority: {
    low_priority: LOW_PRIORITY_ENUM_VALUE,
    medium_priority: MEDIUM_PRIORITY_ENUM_VALUE,
    high_priority: HIGH_PRIORITY_ENUM_VALUE
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
  validates :disabled_at, :disabled_by_user, presence: true, if: :disabled?

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

  def priority_number
    self.class.priorities.keys.reverse.index(priority)
  end

  def status_number
    MaintenanceTaskStateMachine.states.index(state_machine.current_state)
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

  def disabled?
    disabled_at.present? || disabled_by_user.present?
  end

  def associate_uploads_to_maintenance_task_images
    return if maintenance_task_image_ids.blank?

    image_uploads = MaintenanceTaskImage.where(id: maintenance_task_image_ids)

    return if image_uploads.blank?

    maintenance_task_images << image_uploads
  end
end
