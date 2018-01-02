import get from 'lodash/get';
import find from 'lodash/find';
import keys from 'lodash/keys';

const propertyKeys = {
    profit_growth_5years: 'warehouse_set.profit_growth_5years',
    profit_growth_10years: 'warehouse_set.profit_growth_10years',
    market_capitalization: 'warehouse_set.market_capitalization',
    current_price: 'warehouse_set.current_price'
};

const getProperty = (object, key, index) => {
    let propKey = propertyKeys[key] || key;
    if (index !== undefined) {
        propKey = propKey.replace('${index}', index);
    }
    const value = get(object, propKey);
    return value;
};

const getYearsSorted = (object) => {
    const values = getNumberSet(object, 'balancesheet', 'Share Capital');
    return keys(values)
        .map(value => Number.parseInt(value.split('-')[0]))
        .sort()
        .reverse();
};

const  print = (o) => console.log(JSON.stringify(o));

const getNumberSet = (object, key, field, year) => {
    const numset = get(object, `number_set.${key}`);
    if (numset && field) {
        const fieldValue = find(numset, (o) => o[0] === field);
        if (year && fieldValue) {
            return fieldValue[1][`${year}-03-31`];
        }
        return fieldValue && fieldValue[1];
    }
    return numset;
};

module.exports = {
    getFCF(object, size) {
        return getYearsSorted(object)
            .slice(0, size)
            .map((year) => {
                const operatingCost = getNumberSet(object, 'cashflow', 'Cash from Operating Activity', year);
                const purchaseCost = getNumberSet(object, 'cashflow', 'Fixed Assets Purchased', year) || 0;
                return operatingCost - purchaseCost;
            });
    },
    getProfitGrowthRate(object) {
        return {
            first: getProperty(object, 'profit_growth_5years'),
            second: getProperty(object, 'profit_growth_10years')
        }
    },
    getNetDebt(object) {
        const year = getYearsSorted(object)[0];
        return getNumberSet(object, 'balancesheet', 'Borrowings', year)
            + getNumberSet(object, 'balancesheet', 'Other Liabilities', year)
            - getNumberSet(object, 'balancesheet', 'Investments', year);
    },
    getNoOfShares(object) {
        return getProperty(object, 'market_capitalization')/getProperty(object, 'current_price');
    },
    getCurrentYear(object) {
        return getYearsSorted(object)[0];
    }
};

