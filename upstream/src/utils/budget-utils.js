String.prototype.toDollarString = function () {
    return `$ ${this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

module.exports = {
    checkE: (event) => event.keyCode === 69 ? event.preventDefault() : null
};