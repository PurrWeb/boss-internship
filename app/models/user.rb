class User < ActiveRecord::Base
  ROLES = ['admin', 'manager']

  has_many :venues

  include Enableable

  # Include default devise modules. Others available are:
  # :registerable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :validatable, :lockable, :confirmable

  validates :role, inclusion: { in: ROLES, message: 'is required' }
  validates :enabled, presence: true
  validates :first_name, presence: true
  validates :surname, presence: true

  def full_name
    [first_name, surname].join(' ')
  end
end
