json.array! staff_members do |staff_member|
  json.partial! 'api/v1/shared/staff_member.json', locals: { staff_member: staff_member }
end
