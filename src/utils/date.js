
const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];

var date = {
    toRussianString(date) {
        var month = months[date.getMonth()].toLowerCase();
        return `${date.getDate()} ${month} ${date.getFullYear()}`;
    }
};

export { months };

export default date;