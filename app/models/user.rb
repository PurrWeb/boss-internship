class User < ActiveRecord::Base
  ROLES = ['admin', 'manager']

  has_many :venues

  belongs_to :name
  accepts_nested_attributes_for :name, allow_destroy: false

  belongs_to :email_address, inverse_of: :users
  accepts_nested_attributes_for :email_address, allow_destroy: false

  include Enableable

  # Include default devise modules. Others available are:
  # :registerable, :timeoutable, :validatable, and :omniauthable
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
          :lockable, :authentication_keys => [:devise_email]

  validates :role, inclusion: { in: ROLES, message: 'is required' }
  validates :enabled, presence: true
  validates :name, presence: true
  validates :email_address, presence: true

  delegate :full_name, :first_name, :surname, to: :name

  def email
    email_address.try(:email)
  end

  # Required to stop devise complaining about not using a proper email field
  def email_changed?
    false
  end

  def self.find_for_database_authentication(warden_conditions={})
    conditions = warden_conditions.dup
    if email = conditions.delete(:devise_email)
      where(conditions.to_hash).
        joins(:email_address).
        merge(EmailAddress.where(email: email)).
        first
    else
      where(conditions.to_hash).first
    end
  end

    def devise_email=(devise_email)
      @devise_email = devise_email
    end

    def devise_email
      @devise_email || email
    end

  def email_required?
    false
  end

  def status
    enabled? ? 'Active' : 'Disabled'
  end
end
