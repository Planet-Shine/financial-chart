
const dom = {
    getCoords(element) {
        var box = element.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {
            y: top,
            x: left
        };
    },
    getMousePos(element, pageMousePosition) {
        if (arguments.length === 2) {
            let elementCoords = dom.getCoords(element);
            let resultPoint = {
                x: pageMousePosition.x - elementCoords.x,
                y: pageMousePosition.y - elementCoords.y
            };
            return resultPoint;
        }
        let event = element;
        return dom.getMousePos(event.currentTarget, {
            x: event.pageX,
            y: event.pageY
        });
    }
};

export default dom;