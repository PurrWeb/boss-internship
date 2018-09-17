export default function getArrayOfIdsFromReactSelectValue(value) {
  if (value === '' || (Array.isArray(value) && value.length === 0)) {
    return [];
  } else {
    return value.toString().split(',');
  }
}
