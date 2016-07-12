json.rota do
  json.partial!(
    partial: 'api/v1/shared/rota.json',
    locals: { rota: rota }
  )
end

json.staff_members do
  staff_members =  StaffMember.
    joins(:rota_shifts).merge(
      rota.rota_shifts.enabled
    ).
    includes(:staff_type).
    includes(:name).
    includes(:master_venue).
    uniq
  json.partial!(
    partial: 'api/v1/shared/staff_members.json',
    locals: { staff_members: staff_members }
  )
end

json.rota_shifts do
  rota_shifts = rota.
    rota_shifts.
    enabled.
    includes(:staff_member)

  json.partial!(
    partial: 'api/v1/shared/rota_shifts.json',
    locals: { rota_shifts: rota_shifts }
  )
end

json.staff_types do
  json.partial!(
    partial: 'api/v1/shared/staff_types.json',
    locals: { staff_types: staff_types }
  )
end
