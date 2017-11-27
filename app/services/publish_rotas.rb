class PublishRotas
  def initialize(rotas: rotas, nested: false, frontend_updates: )
    @rotas = rotas
    @nested = nested
    @frontend_updates = frontend_updates
  end

  def call
    ActiveRecord::Base.transaction(requires_new: nested) do
      rotas.each do |rota|
        if !rota.published?
          rota.transition_to!(:published)
          frontend_updates.publish_rota(rota: rota)
          StaffMember.
            joins(:rota_shifts).
            merge(rota.rota_shifts).
            mark_requiring_notification!

          UpdateRotaForecast.new(rota: rota).call
        end
      end
    end
  end

  private
  attr_reader :rotas, :nested, :frontend_updates
end
