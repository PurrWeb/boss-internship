class Name < ActiveRecord::Base
  validates :first_name, presence: true
  validates :surname, presence: true

  auto_strip_attributes :first_name, delete_whitespaces: true
  auto_strip_attributes :surname, delete_whitespaces: true

  def full_name
    [first_name, surname].join(' ')
  end
end
