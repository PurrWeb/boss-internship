module PageObject
  class AddressForm < Component
    page_action :fill_in_for do |address|
      scope.fill_in('Address', with: address.address)
      scope.fill_in('Postcode', with: address.postcode)
      scope.fill_in('Country', with: address.country)
      scope.fill_in('County', with: address.county)
    end

    def scope
      parent.scope.find('.address-form')
    end
  end
end
