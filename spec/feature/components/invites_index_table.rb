module PageObject
  class InvitesIndexTable < Component
    def self.columns
      [:email, :role, :status]
    end

    page_action :click_on_detail do |column, invite:|
      listing = index_listing_for(invite)
      listing.find(detail_selector_for(column)).click_link(detail_text(listing, column))
    end

    page_action :ensure_details_displayed_for do |invite|
      listing = index_listing_for(invite)

      expect(detail_text(listing, :email)).to eq(invite.email)

      expect(detail_text(listing, :role)).to eq(invite.role.titleize)

      expect(detail_text(listing, :status)).to eq(invite.current_state.titleize)
    end

    page_action :revoke_invite do |invite|
      listing = index_listing_for(invite)
      listing.click_button 'Revoke'
    end

    page_action :ensure_revoke_button_not_displayed_for do |invite|
      listing = index_listing_for(invite)
      expect(listing.has_button?('Revoke')).to eq(false)
    end

    def scope
      page.find('table[data-role="invites-index-table"]')
    end

    private
    def index_listing_for(invite)
      find(:css, ".boss-table__row[data-invite-id=\"#{invite.id}\"]")
    end

    def detail_text(listing, column)
      section = listing.find(detail_selector_for(column))
        .find(:css, '.boss-table__text_adjust_wrap')
      section.text
    end

    def detail_selector_for(column)
      column_data.fetch(column){
        raise 'unsupported detail'
      }.fetch(:detail_selector)
    end

    def column_data
      {
        email: { detail_selector: '.boss-table__cell[data-role="Email"]' },
        role:  { detail_selector: '.boss-table__cell[data-role="Role"]'  },
        status:  { detail_selector: '.boss-table__cell[data-role="Status"]'  }
      }
    end

  end
end
