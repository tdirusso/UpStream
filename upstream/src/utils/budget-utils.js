const colors = require('../constants/constants');

String.prototype.toDollarString = function () {
    return `$ ${this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

module.exports = {
    checkE: (event) => event.keyCode === 69 ? event.preventDefault() : null,

    calcSpent: (entries) => entries.reduce((previous, current) => (previous + parseFloat(current.amount)), 0).toFixed(2),

    calcCategoryExpenses: (entries, categories) => {
        return categories.map(category => {
            const spent = entries.reduce((previous, current) => {
                if (current.category === category.name) {
                    return previous + parseFloat(current.amount)
                }
                return previous;
            }, 0).toFixed(2);

            const remaining = (parseFloat(category.allocation) - parseFloat(spent)).toFixed(2);
            const percentage = ((parseFloat(spent) / parseFloat(category.allocation)) * 100).toFixed(2)

            return {
                name: category.name,
                allocation: category.allocation,
                spent: spent,
                remaining: remaining,
                percentage: percentage,
                statusColor: remaining < 0 ? colors.overBudget : colors.underBudget
            };
        });
    },

    calcSpendingMap: (entries) => {
        const spendingMap = {};

        entries.forEach(entry => {
            const spent = spendingMap[entry.category];
            if (!spent) {
                spendingMap[entry.category] = entry.amount;
            } else {
                spendingMap[entry.category] = (parseFloat(entry.amount) + parseFloat(spent)).toFixed(2)
            }
        });

        return spendingMap;
    }
};