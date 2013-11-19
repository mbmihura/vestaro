'use strict';

/* Filters */
vestaroMain.

filter('priceBetween', function () {
    return function ( items, minPrice, maxPrice ) {
        var filteredItems = []
        angular.forEach(items, function ( item ) {
            if ( item.price >= minPrice && item.price <= maxPrice ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
    
}).filter('inCategory', function(){
    return function(items, category){
        if(angular.isUndefined(category) || category.id == 1) return items;
        var filteredItems = [];
        angular.forEach(items, function ( item ) {
            if (item.category.id == category.id) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    };
});