
const $math = {
    partOfRange(min, max, value) {
        return (value - min) / (max - min);
    },
    getNearestMaxGraphLimit(value) {
        const [ integerValueString, decimalValueString ] = String(value).split('.');
        var nearstMaximum;
        function getNextMaxDigit(targetDigit) {
            // для  0,1,2,3,4,5,6,7,8, 9
            return [2,2,4,4,6,6,8,8,10,10][targetDigit];
        }
        if (integerValueString && integerValueString !== '0') {
            let digitCount = integerValueString.length;
            let firstDigit = parseInt(integerValueString[0], 10);
            let nextMaxDigit = getNextMaxDigit(firstDigit);
            nearstMaximum = nextMaxDigit * Math.pow(10, digitCount - 1);
        } else {
            let significandDecimalValueString = String(parseInt(decimalValueString, 10));
            let zeroCount = decimalValueString.length - significandDecimalValueString.length;
            let firstDigit = parseInt(significandDecimalValueString[0], 10);
            let nextMaxDigit = getNextMaxDigit(firstDigit);
            nearstMaximum = nextMaxDigit / Math.pow(10, zeroCount);
        }
        return nearstMaximum;
    }

};

export default $math;