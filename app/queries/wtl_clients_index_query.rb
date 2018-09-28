class WtlClientsIndexQuery
  def initialize(filter:)
    @filter = filter
  end

  def all
    wtl_clients = WtlClient.includes([:wtl_card, versions: [:item]]).all
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
      wtl_clients = wtl_clients.where(status: status)
    end
    if card_number.present?
      wtl_clients = wtl_clients.where(card_number: card_number)
    end
    wtl_clients
  end

  private
  attr_reader :filter
end
