module PageObject
  class AddressForm < Component
    page_action :fill_in_for do |address|
      scope.fill_in('Address 1', with: address.address_1)
      scope.fill_in('Address 2', with: address.address_2)
      scope.fill_in('Address 3', with: address.address_3)
      scope.fill_in('Address 4', with: address.address_4)
      scope.fill_in('Postcode', with: address.postcode)
      scope.fill_in('Country', with: address.country)
      scope.fill_in('Region', with: address.region)
    end

    def scope
      parent.scope.find('.address-form')
    end
  end
end
