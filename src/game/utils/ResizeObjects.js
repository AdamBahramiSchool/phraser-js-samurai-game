export function resizeObject(object, scaleNum = 0.8){
    object.setScale(scaleNum);
    object.body.setSize(object.width * 0.5, object.height * 0.5);
    object.refreshBody();
    return object
}