class AccessoriesIndexQuery
  def initialize(venue:, filter:)
    @venue = venue
    @filter = filter
  end

  def all
    accessories = venue.accessories
    accessories = accessories.where(accessory_type: Accessory.accessory_types[filter[:accessoryType]]) if filter[:accessoryType].present?
    if filter[:status].present?
      if filter[:status] == 'enabled'
        accessories = accessories.enabled
      elsif filter[:status] == 'disabled'
        accessories = accessories.disabled
      end
    end
    if filter[:userRequestable].present?
      if filter[:userRequestable] == 'yes'
        accessories = accessories.where(user_requestable: true)
      elsif filter[:userRequestable] == 'no'
        accessories = accessories.where(user_requestable: false)
      end
    end
    if filter[:name].present?
      accessories = accessories.search(filter[:name])
    end
    accessories
  end

  attr_reader :venue, :filter
end
