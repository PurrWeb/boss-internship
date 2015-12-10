class Name < ActiveRecord::Base
  validates :first_name, presence: true
  validates :surname, presence: true

  def full_name
    [first_name, surname].join(' ')
  end
end
