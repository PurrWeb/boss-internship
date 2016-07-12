class PublishRotas
  def initialize(rotas: rotas, nested: false)
    @rotas = rotas
    @nested = nested
  end

  def call
    ActiveRecord::Base.transaction(requires_new: nested) do
      rotas.each do |rota|
        if !rota.published?
          rota.transition_to!(:published)

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
  attr_reader :rotas, :nested
end
