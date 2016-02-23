export default function getArrayOfIdsFromReactSelectValue(value){
    if (value === ""){
            return [];
    } else {
        return value.toString().split(",").map(parseFloat);
    }
}