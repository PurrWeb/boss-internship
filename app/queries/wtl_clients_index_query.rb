class WtlClientsIndexQuery
  ALLOWED_STATUSES = WtlClient.statuses.keys

  def initialize(filter:)
    @filter = filter
  end

  def all
    wtl_clients = WtlClient.includes([:wtl_card]).all
    name = filter[:name]
    email = filter[:email]
    status = filter[:status]
    card_number = filter[:card_number]

    if name.present?
      wtl_clients = wtl_clients.search(name)
    end
    if email.present?
      wtl_clients = wtl_clients.where(email: email)
    end
    if status.present?
      if status == "verified"
        wtl_clients = wtl_clients.where.not(verified_at: nil)
      end
      if status == "pending_verification"
        wtl_clients = wtl_clients.where(verified_at: nil)
      end
    end
    if card_number.present?
      wtl_clients = wtl_clients.joins(:wtl_card).where(wtl_cards: {number: card_number})
    end
    wtl_clients
  end

  private

  attr_reader :filter
end
