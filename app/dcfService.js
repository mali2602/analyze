// const dataService = require('./dataService.js');
const propertyAccessor = require('./propertyAccessor.js');

const average = arr => arr.reduce( ( a, b ) => a + b, 0 ) / arr.length;

const DCF_AVG_NO = 5;
const getAverageDcf = (data) => {
    const values = propertyAccessor.getFCF(data, DCF_AVG_NO);
    return average(values);
};

const getGrowthRates = (data) => {
    const growthRates = propertyAccessor.getProfitGrowthRate(data);
    growthRates.first = growthRates.first || 15;
    growthRates.second = growthRates.second || 12;
    return {
        maxGrowthRate: Math.max(growthRates.first, growthRates.second),
        minGrowthRate: Math.min(growthRates.first, growthRates.second)
    };
};

const getOptions = (data) => {
    return Object.assign( {}, getGrowthRates(data), {
        avgDcf: getAverageDcf(data),
        discountRate: 15 / 100,
        terminalGrowthRate: 2 / 100,
        netDebt: propertyAccessor.getNetDebt(data),
        noOfShares: propertyAccessor.getNoOfShares(data),
        currentYear: propertyAccessor.getCurrentYear(data)
    });
};

const calculateFutureCashflows = (options) => {
    let fcfs = [];
    let prevFcf = options.avgDcf;
    for (let i=0; i < 10; i++){
        const growthRate = (i < 5 ? options.maxGrowthRate : options.minGrowthRate)/100;
        const fcf = prevFcf * (1 + growthRate);
        const pv = fcf / Math.pow(1 + options.discountRate,  i + 1)
        const obj = {
            growthRate,
            fcf,
            pv,
            year: options.currentYear + i + 1
        };
        fcfs.push(obj);
        prevFcf = fcf;
    }
    return fcfs;
};

const calculateDcf = (data) => {
    const options = getOptions(data);
    const fcfs = calculateFutureCashflows(options);
    const lastFcf = fcfs[fcfs.length - 1];
    const terminalYear = lastFcf.fcf * (1 + options.terminalGrowthRate);
    const totalPV = fcfs.reduce((acc, fcf) => acc + fcf.pv, 0);
    const terminalValue = (terminalYear / (options.discountRate - options.terminalGrowthRate)) /
        Math.pow (1 + options.discountRate, 10);
    const totalCF = totalPV + terminalValue;
    const dcfValue = (totalCF - options.netDebt) / options.noOfShares;
    return Object.assign({}, options, {
        fcfs,
        terminalYear,
        totalPV,
        terminalValue,
        totalCF,
        dcfValue
    });
};

// const fetchRecords = (params) => {
//     return dataService.getAll(params)
//         .then((data) => {
//             return calculateDcf(data);
//         })
// };

module.exports.calculateDcf = calculateDcf;
