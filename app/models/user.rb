class User < ActiveRecord::Base
  ROLES = ['admin', 'manager']

  has_many :venues

  belongs_to :name
  accepts_nested_attributes_for :name, allow_destroy: false

  include Enableable

  # Include default devise modules. Others available are:
  # :registerable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :validatable, :lockable, :confirmable

  validates :role, inclusion: { in: ROLES, message: 'is required' }
  validates :enabled, presence: true
  validates :name, presence: true

  delegate :full_name, to: :name
end
