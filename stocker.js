let stock = new Array();
let sales = new Array();

module.exports = {
        addStock : (name, amount) => {

        let item = stock.find((element) => {
                        return element.name == name;
                        });


        if (!amount) {
                amount=1;
        }

        if (item) {
                item.amount += amount;
                console.log('Added ' + amount + ' units to the element. Total ' + item.amount);
        } else {
                stock.push({name: name, amount: amount});
                console.log('Added ' + name + ' to the stock');
        }

        },

        checkStock : (name) => {

                if (name) {
                let item = stock.find((element) => {
                        return element.name == name;
                        });
                if (item) {
                        return item.name + ': ' + item.amount;
                } else {
                        return name + ': 0';
                        console.log('Not in stock ' + name);
                }
                } else {
                        console.log('No name passed to the function');
                        if (stock.length > 0) {
                                stock.sort((a,b)=> {
                                        let nameA = a.name.toUpperCase();
                                        let nameB = b.name.toUpperCase();

                                        if (nameA < nameB) {
                                                return -1;
                                        }

                                        if (nameA > nameB) {
                                                return 1;
                                        }

                                        return 0;
                                });

                                let reg = '';

                                const red = (stck, item, indx) => {
                                        return stck + item.name + ': ' + item.amount + (indx===stock.length-1?'':'\n');
                                }

                                reg = stock.reduce(red,'');

                                console.log(reg);
                                return reg;
                        } else {
                                return 'No stock';
                        }
                        }
        },

        sell : (name, amount, price) => {
                let item = stock.find((element) => {
                        return element.name == name;
                        });

                if (!item) {
                        console.error('Item does not exist');
                        return;
                } else {
                        if(price >0){
                                sales.push({name:item.name,amount:amount,price:price});
                        }

                        item.amount -= amount;
                        console.log('Sold '+ amount + ' units of ' + item.name + ' for ' + price + ' each');
                        return;
                }

        },

        checkSales : () => {

                console.log('Check Sales');

                const red = (sls, item) => {
                        return sls + (parseInt(item.price) * parseInt(item.amount));
                };

                let reg = 'sales: ' + sales.reduce(red,0).toString();
                console.log(reg);
                return (reg);

        },

        deleteAll : () => {
                stock = new Array();
                sales = new Array();
                console.log('Deleted all stock and sales');
                return;
        }

}
