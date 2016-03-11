// based on http://stackoverflow.com/questions/7460272/getting-image-dimensions-using-javascript-file-api
export default function getImageDimensions(dataUrl, callback){
    var img = new Image;

    img.onload = function() {
        // image is loaded; sizes are available
        var { width, height } = img;
        callback({
            width,
            height,
            aspectRatio: width / height
        })
    };

    img.src = dataUrl
}