class RotaShiftsWithDurationQuery
  def initalialize(rota:)
    @rota = rota
  end

  def arel
    rota_shifts = Arel::Table.new(:rota_shifts)

    query = rota_shifts.
      where(rota_shifts[:rota_id].eq(rota.id)).
      where(rota_shifts[:enabled].eq(true))

    query
  end
end
