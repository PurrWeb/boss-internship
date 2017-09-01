class CheckList < ActiveRecord::Base
  has_many :check_list_items
  belongs_to :venue
  
  validates :check_list_items, :presence => true
  validates :venue, presence: true
  validates :name, presence: true
end
