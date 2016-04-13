# Takes relation of any record direct assocaited to venue by venue_id
# and returns all venues not linked to records in the relation
#
class VenueWithoutAssociatedQuery
  def initialize(associated_relation:)
    @associated_relation = associated_relation
  end

  def all
    if associated_relation.count > 0
      Venue.where("id NOT IN (?)", associated_relation.pluck(:venue_id))
    else
      Venue.all
    end
  end

  private
  attr_reader :associated_relation
end
