
var _isTouchDevice = false;

const $dom = {
    getCoords(element, isTouch) {
        var box = element.getBoundingClientRect();
        if (isTouch && !_isTouchDevice) {
            _isTouchDevice = isTouch;
        }
        isTouch = _isTouchDevice;

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + (!isTouch ? + scrollTop - clientTop : 0);
        var left = box.left + (!isTouch ? +  scrollLeft - clientLeft : 0);

        return {
            y: top,
            x: left
        };
    },
    getMousePos(element, pageMousePosition, isTouch) {
        if (arguments.length >= 2) {
            let elementCoords = $dom.getCoords(element, isTouch);
            let resultPoint = {
                x: pageMousePosition.x - elementCoords.x,
                y: pageMousePosition.y - elementCoords.y
            };
            return resultPoint;
        }
        let event = element;
        return $dom.getMousePos(event.currentTarget, {
            x: event.pageX || event.touches && (event.touches[0] || {}).pageX,
            y: event.pageY || event.touches && (event.touches[0] || {}).pageY
        }, event.touches && event.touches.length);
    }
};

export default $dom;