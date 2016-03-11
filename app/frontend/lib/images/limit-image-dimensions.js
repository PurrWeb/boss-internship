import resizeImage from "./resize-image"
import getImageDimensions from "./get-image-dimensions"

/*
    Resizes image if it's bigger than maxWidth x maxHeight.
    Otherwise just calls callback(dataUrl) with the original image.
*/
export default function limitImageDimensions(dataUrl, maxWidth, maxHeight, callback){
    getImageDimensions(dataUrl, function(dimensions){
        if (dimensions.width <= maxWidth && dimensions.height <= maxHeight) {
            callback(dataUrl);
        }

        var newDimensions;
        var scalingFactor;
        if (dimensions.width > dimensions.height){
            scalingFactor = maxWidth / dimensions.width;
            newDimensions = {
                width: maxWidth,
                height: dimensions.height * scalingFactor
            }
        } else {
            scalingFactor = maxHeight / dimensions.height;
            newDimensions = {
                width: dimensions.width * scalingFactor,
                height: maxHeight
            }
        }

        resizeImage(dataUrl, newDimensions.width, newDimensions.height, (resizedDataUrl) => {
            callback(resizedDataUrl);
        });
    });
}
