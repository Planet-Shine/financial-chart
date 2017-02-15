
import palette from './palette';

const pricePointer = {
  line: {
      stroke: palette.pointerLine,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 10000,
      fill: palette.pointerLine,
      strokeDasharray: "4, 4",
      strokeWidth: 1
  },
  aim: {
      cx: 0,
      cy: 0,
      r: 4,
      strokeWidth: 2,
      stroke: palette.background,
      fill: palette.graph
  }
};
export { pricePointer };

const root = {
    style: {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 12
    }
};
export { root };

const graph = {
    strokeWidth: 1.5,
    strokeLinejoin: "round",
    strokeLinecap: "round",
    fill: "none",
    stroke: palette.graph
};
export { graph };


const baseHintStyle = {
    color: palette.hint,
    cursor: 'default',
    fill: palette.hint,
    width: 205,
    textOverflow:'clip'
};

const timeHint = {
    textAnchor: "middle",
    style: Object.assign({
        fontSize: 11
    }, baseHintStyle)   
};
export { timeHint };

const valueHint = {
    textAnchor: "end",
    style: Object.assign({
        fontSize: 11.5
    }, baseHintStyle)
};
export { valueHint };

const yearHint = {
    textAnchor: "start",
    style: Object.assign({
        fontSize: 13
    }, baseHintStyle)
};
export { yearHint };


const axis = {
    fill: "none",
    stroke: palette.axis,
    strokeWidth: 1.5
};
export { axis };

const backgroundBox = {
    fill: palette.background
};
export { backgroundBox };

const pointerClip = {
    y: 0,
    x: -10,             // Дополнительные поля справа и слева, чтобы помещался указатель на крайних точках графика.
    additionalWidth: 20
};
export { pointerClip }

const hitArea = {
    fill: "transparent"
};
export { hitArea };


