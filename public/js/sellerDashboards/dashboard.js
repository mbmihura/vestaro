AmCharts.ready(function () {

	Number.prototype.padLeft =
	function(base, chr){
	   var len = (String(base || 10).length - String(this).length) + 1;
	   return len > 0 ? new Array(len).join(chr || '0') + this : this;
	}
	
	function formatDate(date){
	    return date.getFullYear() + (date.getMonth() + 1).padLeft() + date.getDate().padLeft();
	}
	
	// ==================== Commission ====================
	$('#payButton').click(function(){
		
		seeCommissionDetail();
	});
	
	function seeCommissionDetail(){
		if( $('#commissionDetailModal').find('table').size() == 0 ) {
			jsRoutes.controllers.DashboardController.commissionDetail().ajax({
	 			success: 
				function(details){
					addDetailTable(details);
					$('#commissionDetailModal').modal('show');
					
				}
				});
			}
	}
	jsRoutes.controllers.DashboardController.sellerCommission().ajax({
 	success: 
		function(json){
			$('#commission').text('$'+json.commissionValue);
			if(json.commissionValue > 0){
				$('#mpButton').attr('href',json.commissionCheckoutUrl);
			}
			else{
				$('#payButton').attr('disabled',true);
			}
		}
		});
		

	function formatJsonDate(dateJson){
	 	var d = new Date(dateJson);
	    var day = d.getDate();
	    var month = d.getMonth() + 1;
	    var year = d.getFullYear();
	
	    if (month < 10) {
	        month = "0" + month;
	     }
	     
	    return year + "." + month + "." + day;
	}
	
	function addDetailTable(details){
		var table = $('<table></table>').addClass('table table-striped')	;
		table.append(detailsHeader());
		$.each(details,function(){
	 		var row = $('<tr></tr>');
	 		var id= $('<td></td>').text(this.item.id);
	 		var title= $('<td></td>').text(this.item.title);
	 		var date= $('<td></td>').text(formatJsonDate(this.pay_time));
	 		var commission= $('<td></td>').text("$"+this.commission);
	 		
	 		row.append(id);
	 		row.append(title);
	 		row.append(date);
	 		row.append(commission);
	 		
	 		
	    	table.append(row);
		
		} );
	    
	    table.append(detailsTotal());
		$('.modal-body').append(table);
	}
	
	function detailsTotal(){
		var row = $('<tr></tr>').addClass('success');
		var totalCommissionTitutlo= $('<td></td>').text("Total Comisión");
		var totalCommission= $('<td></td>').text($('#commission').text());
 		var empty1 =$('<td></td>');
 		var empty2 =$('<td></td>');
 		row.append(totalCommissionTitutlo);
 		row.append(empty1);
 		row.append(empty2);
 		row.append(totalCommission);
 		
 		return row;
	}
	
	
	function detailsHeader(){
		var row = $('<tr></tr>');
 		var id= $('<td></td>').text("id Item");
 		var title= $('<td></td>').text("Título Item");
 		var date= $('<td></td>').text("Fecha pago");
 		var commission= $('<td></td>').text("Comisión");
 		
 		row.append(id);
 		row.append(title);
 		row.append(date);
 		row.append(commission);
 		
 		
 		return row;	
	}
	
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
    jsRoutes.controllers.DashboardController.littleItemsStock().ajax({success: 
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
    jsRoutes.controllers.ActionController.actionsFrom(1, formatDate(new Date(date.getFullYear(), date.getMonth(), 1)), formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)), "BUY").ajax({success: 
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
});