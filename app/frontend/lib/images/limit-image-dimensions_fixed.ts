import resizeImage from './resize-image_fixed';
import getImageDimensions from './get-image-dimensions_fixed';

/*
 Resizes image if it's bigger than maxWidth x maxHeight.
 Otherwise just calls callback(dataUrl) with the original image.
 */
export default function limitImageDimensions(dataUrl: any, maxWidth: number, maxHeight: number, callback: (data: any) => void) {
  getImageDimensions(dataUrl, function(dimensions){
    if (dimensions.width <= maxWidth && dimensions.height <= maxHeight) {
      callback(dataUrl);
      return;
    }

    let newDimensions;
    let scalingFactor;

    if (dimensions.width > dimensions.height) {
      scalingFactor = maxWidth / dimensions.width;
      newDimensions = {
        width: maxWidth,
        height: dimensions.height * scalingFactor
      };
    } else {
      scalingFactor = maxHeight / dimensions.height;
      newDimensions = {
        width: dimensions.width * scalingFactor,
        height: maxHeight
      };
    }

    resizeImage(dataUrl, newDimensions.width, newDimensions.height, (resizedDataUrl) => {
      callback(resizedDataUrl);
    });
  });
}
