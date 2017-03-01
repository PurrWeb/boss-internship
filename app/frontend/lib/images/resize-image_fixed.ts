// http://stackoverflow.com/questions/2516117/how-to-scale-an-image-in-data-uri-format-in-javascript-real-scaling-not-usin

export default function resizeImage(dataUrl: any, width: number, height: number, callback: (data: any) => void) {
  const sourceImage: HTMLImageElement = new Image();

  sourceImage.onload = function () {
    // Create a canvas with the desired dimensions
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(sourceImage, 0, 0, width, height);

      // Convert the canvas to a data URL in PNG format
      callback(canvas.toDataURL());
    }
  };

  sourceImage.src = dataUrl;
}
