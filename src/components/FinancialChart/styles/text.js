import palette from './palette';

const base = {
    color: palette.hint,
    cursor: 'default',
    fill: palette.hint,
    width: 205,
    textOverflow:'clip'
};

const timeHint = Object.assign({
    fontSize: 11
}, base);

export { timeHint };


const valueHint = Object.assign({
    fontSize: 11.5
}, base);

export { valueHint };


const yearHint = Object.assign({
    fontSize: 13
}, base);

export { yearHint };