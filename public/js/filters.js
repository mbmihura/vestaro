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
        if(category.id == 0) return items;
        var filteredItems = [];
        angular.forEach(items, function ( item ) {
            if ( item.title.toLowerCase().search(category.name.toLowerCase()) != -1 ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    };
});