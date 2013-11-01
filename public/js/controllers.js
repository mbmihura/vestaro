'use strict';

/* Controllers */
vestaroMain.

controller('serverPageRoutingCtrl', ['$scope', '$routeParams', '$location',function($scope, $routeParams, $location){
  $scope.templateUrl = $location.$$url;
}])

.controller('GarmentListCtrl', ['$scope','$http', function($scope, $http){
  	$http.get('/garment').success(function(list) {
		$scope.list = list;
	});;
}])

.controller('GarmentListCCtrl', ['$scope','$http', function($scope, $http){
  	$http.get('/garment').success(function(list) {
		$scope.list = list;
	});;
}])

.controller('GarmentNewCtrl', ['$scope', function($scope){
  $scope.save = function() {
    //TODO:
  }
}])

.controller('GarmentEditCtrl', ['$scope', function($scope){
  
}])

.controller('NavCtrl', ['$scope', '$location', function($scope, $location) {
    $scope.views = [
      {path: '/', title: 'Inicio', icon: 'home'},
      {path: '/wishlist', title: 'Wishlist', icon: 'star'},
      {path: '/buyerProfile', title: 'Perfil', icon: 'user'},
      {path: '/itemSearch', title: 'Prendas', icon: 'th'}];
	  
    $scope.isActive = function(view) {
      if (view.path == $location.path()) {
        return true;
      }
      return false;
    };
    
}]);

/* Controllers */
function BuyerHomeCtrl($scope, buyerSession) {
  $scope.hideAlertModal = buyerSession.hideAlertModal();
  buyerSession.getItems().success(function(data){
	  $scope.items = data;
  });
  
  buyerSession.getPopularItems().success(function(data){
	  $scope.popularItems = data;
  });
  
  $scope.$on('isotope', isotopeHandling);
  
  $scope.showBuyItemModal = function(item){
	  $scope.item = item;
	  $('#buyItemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  buyerSession.addToWishlist(item, $scope);
  }
  
  var $container = $('#itemsContainer');
	// Toggles item size
	$container.on('click', '.item-img', function() {
		var $item = $(this).closest('.item'); 
		if ($item.hasClass('large')) {
			$item.removeClass('large');
		} else {
			$container.find('.item.large').removeClass('large');
			$item.closest('.item').addClass('large');
		}
		$container.isotope('reLayout');
	});
	
	// Toggles item information
	$container.on('.item', 'mouseenter mouseleave', function(e) {
		e.preventDefault();
		$(this).find('.itemInformation').fadeToggle('fast');
	});
	
	// Toggle know more
	$('#knowMoreBtn').click(function(){
		$('#knowMore').slideToggle()
	})
  
}

var isotopeHandling = function(ngRepeatFinishedEvent) {
	var $container = $('#itemsContainer');
	var options = {
		itemSelector : '.item',
		getSortData : {
			category : function($elem) {
				return $elem.attr('data-category');
			},
			price : function($elem) {
				return parseFloat($elem.find('.price').text().replace('$', ''));
			},
			title : function($elem) {
				return $elem.find('.title').text();
			}
		}
	};
	
	// Wait until all images are loaded
	$container.imagesLoaded(function() {
		$container.isotope(options);
	});
	
	var $optionSets = $('#itemsControls .option-set'),
	$optionLinks = $optionSets.find('.option');
	
	// Filters and ordering
	$optionLinks.click(function(){
		var $this = $(this);
		// don't proceed if already selected
		if ( $this.hasClass('selected') ) {
		  return false;
		}
		var $optionSet = $this.parents('.option-set');
		$optionSet.find('.selected').removeClass('selected').removeClass('active');
		$this.addClass('selected').addClass('active');
		
		// make option object dynamically, i.e. { filter: '.my-filter-class' }
		var options = {},
		    key = $optionSet.attr('data-option-key'),
		    value = $this.attr('data-option-value');
		// parse 'false' as false boolean
		value = value === 'false' ? false : value;
		options[ key ] = value;
		if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
		  // changes in layout modes need extra logic
		  changeLayoutMode( $this, options )
		} else {
		  // otherwise, apply new options
		  $container.isotope( options );
		}
		
		return false;
	});	
}

function ItemSearchCtrl($scope, buyerSession) {
  $scope.hideAlertModal = buyerSession.hideAlertModal();
  $scope.categories = buyerSession.getCategories();
  
  buyerSession.getItems().success(function(data) {
	  $scope.items = data;
  });
  
  $scope.showBuyItemModal = function(item){
	  $scope.item = item;
	  $('#buyItemModal').modal('show');
  }
  
  $scope.addToWishlist = function(item){
	  buyerSession.addToWishlist(item, $scope);
  }
  
}

function WishlistCtrl($scope, buyerSession, $http) {
	$scope.hideAlertModal = buyerSession.hideAlertModal();
	buyerSession.getWishlist().success(function(data) {
		$scope.wishlistItems = data;
	});
	
	$scope.removeFromWishlist = function(item, idx) {
		buyerSession.removeFromWishlist(item.id).success(function(data) {
			console.log(data);
			$scope.wishlistItems.splice(idx, 1);
			$scope.alert = {title:'Prenda eliminada de Wishlist',
					type:'info',
					body: 'La prenda ' + item.title + ' fue eliminada de tu wishlist.',
					btns: {primary: {title: 'Seguir', href: ''},
						   'default': {title: 'Ir a Home', href: '#/'}
					}
			};
			$('#alertModal').modal('show');
		});
	}
}


function SellerDashboardCtrl($scope){
		Number.prototype.padLeft =
	function(base, chr){
	   var len = (String(base || 10).length - String(this).length) + 1;
	   return len > 0 ? new Array(len).join(chr || '0') + this : this;
	}
	
	function formatDate(date){
	    return date.getFullYear() + (date.getMonth() + 1).padLeft() + date.getDate().padLeft();
	}
	
	// ==================== Commission ====================
	var chart;
	var date = new Date();
	var remainingTime = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate() - date.getDate();
	var chartData = [{
	    "commission": "",
	        "max": (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate(),
	        "min": 0,
	        "value": date.getDate()
	}];
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "commission";
    chart.startDuration = 1;
    chart.columnWidth = 0.5;
    chart.rotate = true;
    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridPosition = "start";
    categoryAxis.axisColor = "#000000";
    categoryAxis.dashLength = 3;
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.dashLength = 3;
    valueAxis.axisAlpha = 0.2;
    valueAxis.position = "top";
    valueAxis.minorGridEnabled = true;
    valueAxis.minorGridAlpha = 0.08;
    valueAxis.gridAlpha = 0.15;
    chart.addValueAxis(valueAxis);
    var graph1 = new AmCharts.AmGraph();
    graph1.type = "column";
    graph1.valueField = "max";
    graph1.lineAlpha = 0;
    graph1.balloonText = "Días restantes: " + remainingTime;
    graph1.fillColors = "#000000";
    graph1.fillAlphas = 0.8;
    chart.addGraph(graph1);
    var graph2 = new AmCharts.AmGraph();
    graph2.type = "line";
    graph2.lineColor = "#000000";
    graph2.bulletColor = "#FFFF00";
    graph2.bulletBorderColor = "#FFFF00";
    graph2.bulletBorderThickness = 2;
    graph2.bulletBorderAlpha = 1;
    graph2.valueField = "value";
    graph2.lineThickness = 2;
    graph2.bullet = "round";
    graph2.fillAlphas = 0;
    graph2.balloonText = "Días restantes: " + remainingTime;
    chart.addGraph(graph2);
    chart.write("chartdiv_commission");
	
    // ==================== Stock ====================
    jsRoutes.controllers.DashboardController.littleItemsStock(1).ajax({success: 
		function(json)
		{
			chart = new AmCharts.AmSerialChart();
			chart.dataProvider = json;
			chart.categoryField = "id";
			chart.marginRight = 0;
			chart.marginTop = 0;
			chart.autoMarginOffset = 0;
			chart.depth3D = 20;
			chart.angle = 30;
			var categoryAxis = chart.categoryAxis;
			categoryAxis.labelRotation = 90;
			categoryAxis.dashLength = 5;
			categoryAxis.gridPosition = "start";
			var valueAxis = new AmCharts.ValueAxis();
			valueAxis.dashLength = 5;
			chart.addValueAxis(valueAxis);
			var graph = new AmCharts.AmGraph();
			graph.valueField = "stock";
			graph.balloonText = "Stock disponible del talle [[size]]: [[stock]]";
			graph.type = "column";
			graph.lineAlpha = 0;
			graph.fillColors = generateRandomColor();
			graph.lineColor = "#000000";
			graph.fillAlphas = 1;
			chart.addGraph(graph);
			chart.write("chartdiv_stock");
		}
	});
    
    // ==================== Monthly boughts ====================
    jsRoutes.controllers.ActionController.actionsFrom(1, 1, formatDate(new Date(date.getFullYear(), date.getMonth(), 1)), formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)), "BUY").ajax({success: 
		function(json)
		{
			var chart = new AmCharts.AmSerialChart();
		    chart.dataProvider = json;
		    chart.categoryField = "id";                
		    chart.rotate = true;
		    chart.depth3D = 20;
		    chart.angle = 30;
		    var categoryAxis = chart.categoryAxis;
		    categoryAxis.gridPosition = "start";
		    categoryAxis.axisColor = "#DADADA";
		    categoryAxis.fillAlpha = 1;
		    categoryAxis.gridAlpha = 0;
		    categoryAxis.fillColor = "#FAFAFA";
		    var valueAxis = new AmCharts.ValueAxis();
		    valueAxis.axisColor = "#DADADA";
		    valueAxis.gridAlpha = 0.1;
		    chart.addValueAxis(valueAxis);
		    var graph = new AmCharts.AmGraph();
		    graph.valueField = "purchases";
		    graph.type = "column";
		    graph.balloonText = "[[description]]: [[purchases]] unidades vendidas";
		    graph.lineAlpha = 0;
		    graph.fillColors = generateRandomColor();
		    graph.fillAlphas = 1;
		    chart.addGraph(graph);
		    chart.write("chartdiv_mostMonthlyBoughtItems");
		}
	});
}

function SellerDashboardFullCtrl($scope){
	}
function CollectionsCtrl(){}
function SelletSettingsCtrl(){}