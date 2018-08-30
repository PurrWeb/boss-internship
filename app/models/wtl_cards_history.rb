class WtlCardsHistory < ActiveRecord::Base
  has_paper_trail

  belongs_to :user
  belongs_to :wtl_card
  belongs_to :wtl_client

  validates :wtl_card, presence: true
end
