module PageObject
  class NameForm < Component
    page_action :fill_in_for do |name|
      scope.fill_in('First name', with: name.first_name)
      scope.fill_in('Surname', with: name.surname)
    end

    page_action :ui_shows_name do |name|
      first_name_field = scope.find_field('First name')
      expect(first_name_field.value.to_s).to eq(name.first_name.to_s)
      surname_field = scope.find_field('Surname')
      expect(surname_field.value.to_s).to eq(name.surname.to_s)
    end

    def scope
      parent.scope.find('.name-form')
    end
  end
end
