json.rota do
  json.partial!(
    partial: 'api/v1/shared/rota.json',
    locals: { rota: rota }
  )
end

json.staff_members do
  json.partial!(
    partial: 'api/v1/shared/staff_members.json',
    locals: {
      staff_members: StaffMember.joins(:rota_shifts).merge(
        rota.rota_shifts.enabled
      ).uniq
    }
  )
end

json.rota_shifts do
  json.partial!(
    partial: 'api/v1/shared/rota_shifts.json',
    locals: { rota_shifts: rota.rota_shifts.enabled }
  )
end

json.staff_types do
  json.partial!(
    partial: 'api/v1/shared/staff_types.json',
    locals: { staff_types: staff_types }
  )
end
