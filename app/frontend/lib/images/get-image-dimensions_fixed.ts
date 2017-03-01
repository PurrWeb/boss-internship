// based on http://stackoverflow.com/questions/7460272/getting-image-dimensions-using-javascript-file-api

interface Dimensions {
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
}

export default function getImageDimensions(dataUrl: any, callback: (dimensions: Dimensions) => void) {
    const img: HTMLImageElement = new Image;

    img.onload = function() {
        // image is loaded; sizes are available
        const { width, height } = img;
        callback({
            width,
            height,
            aspectRatio: width / height
        });
    };

    img.src = dataUrl;
}
