const $dom = {
    getCoords(element) {
        var box = element.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left +  scrollLeft - clientLeft;

        return {
            y: Math.round(top),
            x: Math.round(left)
        };
    },
    getMousePos(element, pageMousePosition, isTouch) {
        if (arguments.length >= 2) {
            let elementCoords = $dom.getCoords(element);
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
        });
    }
};

export default $dom;