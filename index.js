const express = require('express');
const cors = require('cors');
const data = require('./data/products');

var app = express();

app.use(cors());

app.get('/', function(req, res){
    res.end('Welcome to the shopping api');
})

app.get('/allProducts', function(req, res){
    res.json(data);
})

app.get('/product/id=:id', function(req, res){
    var id = req.params.id;
    var stock = data.filter(function(item){
        return item.id == id;
    });
    if(stock.length){
        res.json(stock[0]);
    } else {
        res.end('cant find product with this id');
    }

});

app.get('/products/instock=:instock', function(req, res){
    var filter = req.params.instock;
    inStock(data, filter, function(response){
        if(response == 'invalid'){
            res.end('invalid request');
        } else {
            res.end(JSON.stringify(response));
        }
    });
});

app.get('/products/min=:min', function(req, res){
    var filter = req.params.min;
    checkmin(data, filter, function(response){
        if(response == 'invalid'){
            res.end('invalid request');
        } else {
            res.end(JSON.stringify(response));
        }
    })
});

app.get('/products/max=:max', function(req, res){
    var filter = req.params.max;
    checkmax(data, filter, function(response){
        if(response == 'invalid'){
            res.end('invalid request');
        } else {
            res.end(JSON.stringify(response));
        }
    });
});

app.get('/products/min=:min/max=:max', function(req, res){
    var minValue = req.params.min;
    var maxValue = req.params.max;
    checkmin(data, minValue, function(minResponse){
        if(minResponse == 'invalid'){
            res.end('invalid request for min');
        } else {
            checkmax(minResponse, maxValue, function(response){
                if(response == 'invalid'){
                    res.end('invalid request for max');
                } else {
                    res.end(JSON.stringify(response));
                }
            });
        }
    })
});

app.get('/products/instock=:instock/min=:min/max=:max', function(req, res){
    var inStockValue = req.params.instock;
    var minValue = req.params.min;
    var maxValue = req.params.max;
    inStock(data, inStockValue, function(instockResponse){
        if(instockResponse == 'invalid'){
            res.end('invalid request for in stock');
        } else {
            checkmin(instockResponse, minValue, function(minResponse){
                if(minResponse == 'invalid'){
                    res.end('invalid request for min');
                } else {
                    checkmax(minResponse, maxValue, function(response){
                        if(response == 'invalid'){
                            res.end('invalid request for max');
                        } else {
                            res.end(JSON.stringify(response));
                        }
                    });
                }
            })
        }
    });
})

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
    console.log('Server is running on port '+app.get('port'));
})

function inStock(data, filter, callback){
    if(filter == 'all'){
        var stock = data;
    } else if(filter == 'true'){
        var stock = data.filter(function(item){
            return item.in_stock == true;
        });
    } else if (filter == 'false'){
        var stock = data.filter(function(item){
            return item.in_stock == false;
        });
    } else {
        var stock = 'invalid';
    }
    return callback(stock);
}

function checkmin(data, filter, callback){
    if(filter.match(/^[0-9]\d*(\.\d+)?$/) != null){
        var minPrice = Number(filter);
        var stock = data.filter(function(item){
            return item.product_price > minPrice;
        });
    } else {
        var stock = 'invalid';
    }
    return callback(stock);
}

function checkmax(data, filter, callback){
    if(filter.match(/^[0-9]\d*(\.\d+)?$/) != null){
        var maxPrice = Number(filter);
        var stock = data.filter(function(item){
            return item.product_price < maxPrice;
        });
    } else {
        var stock = 'invalid';
    }
    return callback(stock);
}
