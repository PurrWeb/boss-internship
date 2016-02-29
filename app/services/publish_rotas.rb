class PublishRotas
  def initialize(rotas: rotas)
    @rotas = rotas
  end

  def call
    ActiveRecord::Base.transaction do
      rotas.each do |rota|
        if rota.new_record?
          rota.save!
        end

        if !rota.published?
          rota.transition_to!(:published)

          StaffMember.
            joins(:rota_shifts).
            merge(rota.rota_shifts).
            find_each(&:mark_requiring_notification!)

          UpdateRotaForecast.new(rota: rota).call
        end
      end
    end
  end

  private
  attr_reader :rotas
end
