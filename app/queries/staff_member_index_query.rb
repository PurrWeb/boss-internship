class StaffMemberIndexQuery
  def initialize(
    relation:,
    staff_type_proc:,
    status_proc:,
    name_text:,
    email_text:,
    venue:,
    accessible_venues:,
    filter_master_venue:,
    filter_venues: true
  )
    @relation = relation
    @staff_type_proc = staff_type_proc
    @status_proc = status_proc
    @name_text = name_text
    @email_text = email_text
    @filter_venues = filter_venues
    @venue = venue
    @accessible_venues = accessible_venues
    @filter_master_venue = filter_master_venue
  end

  def all
    @all ||= begin
      result = status_proc.call(relation)
      result = staff_type_proc.call(result)

      if name_text.present?
        search_text = name_text.strip.gsub(/\s{2,}/, ' ')

        result = result.
          joins(:name).
          where(
            "( concat(`names`.first_name, ' ', `names`.surname) LIKE ?) OR (`names`.first_name LIKE ?) OR (`names`.surname LIKE ?)",
            "%#{search_text}%",
            "%#{search_text}%",
            "%#{search_text}%"
          )
      end

      if email_text.present?
        result = result.
          joins(:email_address).
          where("LOWER(`email_addresses`.email) = LOWER(?)", email_text.strip)
      end

      if filter_venues
        if venue.present? && accessible_venues.include?(venue)
          if filter_master_venue
            result = result.where(master_venue_id: venue.id)
          else
            result = result.for_venue(venue)
          end
        else
          result = result.for_venues(venue_ids: accessible_venues.pluck(:id))
        end
      end

      result.uniq
    end
  end

  private
  attr_reader :relation, :staff_type_proc, :status_proc, :email_text, :name_text, :venue, :accessible_venues, :filter_venues, :filter_master_venue

  def self.filter_by_status(status:, relation:)
    case status
    when 'enabled'
      relation.enabled
    when 'disabled'
      relation.disabled
    else
      relation
    end
  end
end
