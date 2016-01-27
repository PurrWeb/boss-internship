json.array! staff_types do |staff_type|
  json.partial! 'api/v1/shared/staff_type.json', locals: { staff_type: staff_type }
end
