// check for Geolocation support
if (navigator.geolocation) {
  console.log('Geolocation is supported!');
}
else {
  console.log('Geolocation is not supported for this Browser/OS.');
}

window.onload = function() {
var startPos;
  var nudge = document.getElementById("nudge");

  var showNudgeBanner = function() {
    // nudge.style.display = "block";
  };

  var hideNudgeBanner = function() {
    // nudge.style.display = "none";
  };

  var nudgeTimeoutId = setTimeout(showNudgeBanner, 5000);

  var geoSuccess = function(position) {
    hideNudgeBanner();
    // We have the location, don't display banner
    clearTimeout(nudgeTimeoutId); 

    // Do magic with location
    startPos = position;
    console.log(startPos);
    //document.getElementById('startLat').innerHTML = startPos.coords.latitude;
    //document.getElementById('startLon').innerHTML = startPos.coords.longitude;
  };
  var geoError = function(error) {
    switch(error.code) {
      case error.TIMEOUT:
        // The user didn't accept the callout
        showNudgeBanner();
        break;
    }
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};
$(function () {
	
	//var lock = window.navigator.requestWakeLock('screen');
	
	var widthCanvas  = window.innerWidth*5/6;
	var heightCanvas = window.innerHeight/2;
	var dessin, context;
	
	var podo_stepSize = localStorage.podo_stepSize || 50,
		podo_weight = localStorage.podo_weight || 70;
		podo_step = localStorage.podo_step || 0,
		podo_speed = localStorage.podo_speed || 0,
		podo_calory = localStorage.podo_calory || 0,
		isGPSEnabled = localStorage.isGPSEnabled || false;
		
	var podo = new Pedometer();
	
	var lang = new languageApp(window.navigator.language);
	
	//init pedometer
	podo.setCountStep(Math.round(podo_step));
	podo.setWeight(Math.round(podo_weight));
	podo.setStepSize(Math.round(podo_stepSize));
	podo.setMeanSpeed(Math.round(podo_speed*1000.)/1000.);
	podo.setCalory(Math.round(podo_calory*1000.)/1000.);
	podo.setIsGPSEnabled(Boolean(isGPSEnabled));
	//podo.setUserId(1);
	
	var activatePodo = 1;
	var textActivate = lang.$pause;
	
	//---------------
	// GPS event
	//---------------
	window.addEventListener("compassneedscalibration", function(event) {
		alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
		event.preventDefault();
	}, true);

	// Backbone Views	
	var StepView = Backbone.View.extend({
		el: 'body',
		template: _.template(
			'<section id="index" data-position="current">' +
					'<section data-type="sidebar">' +
						'<header>' +
							'<menu type="toolbar">' +
								'<a href="#">' + lang.$done + '</a>' +
							'</menu>' +
							'<h1>Menu</h1>' +
						'</header>' +
						'<nav>' +
							'<ul>' +
								'<li><a id="btn-pedometer" href="#">'+  lang.$title +'</a></li>' +
								'<li><a id="btn-settings" href="#/settings">' + lang.$settings + '</a></li>' +
								'<li><a id="btn-info" href="#/info">' + lang.$info + '</a></li>' +
							'</ul>' +
						'</nav>' +
					'</section>' +
		'' +
					'<!--........................ Drawer ...............................-->' +
					'<section id="drawer" role="region">' +
						'<header class="fixed">' +
							'<a href="#"><span class="icon icon-menu">' + lang.$hide + '</span></a>' +
							'<a href="#drawer"><span class="icon icon-menu">' + lang.$show + '</span></a>' +
							'<h1>' + lang.$title + '</h1>' +
						'</header>' +
						'<article id="selected" class="content scrollable header">' +
							'<canvas id="canvas" width="' + widthCanvas  + '" height="'+ heightCanvas + '">' + 
							'</canvas>' +  
							'<table id="dataTable">' +
								'<tr>' +
									'<th>' + lang.$distance + '<br/>(km)</th>' +
									'<th>' + lang.$meanSpeed + '<br/>(km/h)</th>' +
									'<th>' + lang.$calories + '</th>' +
								'</tr>' +
								'<tr>' +
									'<td><span id="distance-number">0</span></td>' +
									'<td><span id="speed-number">0</span></td>' +
									'<td><span id="calory-number">0</span></td>' +
								'</tr>' +
							'</table>' +
							'<div class="data-section">' + 
								'<div id="coordinates"></div>' +
							'</div>' +
							'<div class="settings-btns">' +
								'<div class="half">' +
									'<button id="btn-activatePodo"><span id="textActivation">' + textActivate + '</span></button>' +
									'<button id="btn-raz" class="danger">' + lang.$reinit + '</button>' +
								'</div>' +
							'</div>' +
						'</article>' +
					'</section> <!-- end drawer -->' +
		'' +
				'</section> <!-- end index -->'
		),
		
		events: {
			'click #btn-raz': 'reinit',
			'click #btn-activatePodo': 'onWorks'
		},
		
		initialize: function () {
			$('body').html(this.el);
			
			getGPSLocation(lang, podo);
			
			this.render();
		},

		render: function () {
			
			this.$el.html(this.template());
			
		},
		
		reinit: function () {
			podo_step   = localStorage.podo_step = 0;
			podo_speed  = localStorage.podo_step = 0;
			podo_calory = localStorage.podo_calory = 0;
			
			podo.countStep = 0;
			podo.distance  = 0;
			podo.speed     = 0;
			podo.meanSpeed = 0;
			podo.calory    = 0;
			podo.stepArr   = new Array();

			$('#distance-number').html(podo.distance);
			$('#calory-number').html(podo.calory);
			$('#speed-number').html(podo.meanSpeed);
			
			dessin  = document.querySelector('#canvas');
			context = dessin.getContext('2d');
			podo.onDraw(context, widthCanvas, heightCanvas);
			
			getGPSLocation(lang, podo);
		},
		
		onWorks: function () {
			if (activatePodo) {
				activatePodo = 0;
				textActivate = lang.$play;
			} else {
				activatePodo = 1;
				textActivate = lang.$pause;
			}
			$('#textActivation').html(textActivate);
		}
	});
	
	var SettingsView = Backbone.View.extend({
	template: _.template(
			'<header>' +
				'<h2>' + lang.$gpsEnabled + ' ' +
					'<label class="pack-switch">' +
						'<input id="gpsLabel" class="settings-label" type="checkbox" data-type="switch" checked>' + 
						'<span></span>' +
					'</label>' + 
// 					'<span id="resultsGPS">0</span>' + 
			'</h2></header>' +
			'<div id="gpsSwitch"></div>' +
			'<header><h2>' + lang.$stepSize + ' (cm): <input id="stepSizeLabel" type="number" class="settings-label"></input></h2></header>' +
			'<div id="stepSizeSlider"></div>' +
			'<header><h2>' + lang.$weight + ' (kg): <input id="weightLabel" type="number" class="settings-label"></input></h2></header>' +
			'<div id="weightSlider"></div>' +
			'<header><h2></h2></header>' + 
			'<div class="settings-btns">' +
				'<div class="half">' +
					'<button id="btn-save">' + lang.$save + '</button>' +
					'</div>' +
					'<div class="half">' +
					'<button id="btn-default" class="danger">' + lang.$default + '</button>' +
				'</div>' +
			'</div>'
		),
		events: {
			'click #btn-save': 'save',
			'click #btn-default': 'defaults'
		},
		initialize: function () {
			$("#selected").html(this.el);
			this.render();

			// Configure settings sliders
			var $stepSizeLabel = $('#stepSizeLabel'),
				$weightLabel = $('#weightLabel');

			$('#stepSizeSlider').noUiSlider({
				range: [30, 100],
				start: [50],
				handles: 1,
				step: 1,
				serialization: {
					resolution: 1,
					to: $stepSizeLabel
				}
			});

			$('#weightSlider').noUiSlider({
				range: [30, 150],
				start: [70],
				handles: 1,
				step: 1,
				serialization: {
					resolution: 1,
					to: $weightLabel
				}
			});

			//Initialize sliders
			$('#stepSizeSlider').val(podo_stepSize);
			$('#weightSlider').val(podo_weight);
			
			//Initialize switch
			document.getElementById("gpsLabel").checked = Boolean(isGPSEnabled);
// 			$('#resultsGPS').html(isGPSEnabled);

		},
		render: function () {
			this.$el.html(this.template());
		},
		
		save: function () {
			podo_stepSize = localStorage.podo_stepSize = $('#stepSizeSlider').val();
			podo_weight = localStorage.podo_weight = $('#weightSlider').val();
			
			if (document.getElementById("gpsLabel").checked) {
				podo.setIsGPSEnabled(true);
				isGPSEnabled = localStorage.isGPSEnabled = true;
			} else {
				podo.setIsGPSEnabled(false);
				isGPSEnabled = localStorage.isGPSEnabled = false;
				navigator.geolocation.clearWatch(podo.idGPS); // desactivate GPS
			};

			$('header.fixed h1').append("<section role='status'><p><strong>" + lang.$changesSaved + "</strong>.</p></section>");
			
			setTimeout(function () {
				$('[role="status"]').remove();
			}, 2000);
		},

		defaults: function () {
			podo_stepSize = localStorage.podo_stepSize = 80;
			podo_weight = localStorage.podo_weight = 70;
			
			if (document.getElementById("gpsLabel").checked !== true) {
				navigator.geolocation.clearWatch(podo.idGPS);
			}
			podo.setIsGPSEnabled(false);
			isGPSEnabled = localStorage.isGPSEnabled = false;
			document.getElementById("gpsLabel").checked = Boolean(isGPSEnabled);
			
			
			$('#stepSizeSlider').val(podo_stepSize);
			$('#weightSlider').val(podo_weight);

			$('header.fixed h1').append("<section role='status'><p>" + lang.$defaultLoaded + ".</p></section>");
			
			setTimeout(function () {
				$('[role="status"]').remove();
			}, 2000);
		}
	});
	
	var InfoView = Backbone.View.extend({
		template: _.template(
			'<header><h1>'+ lang.$info +'</h1></header>' +
				'<p>' + lang.$help +
				'</p>'
		),
		initialize: function () {
			$("#selected").html(this.el);
			this.render();
		},
		render: function () {
			this.$el.html(this.template());
		}
	});

	var Router = Backbone.Router.extend({
		routes : {
			"" : "home",
			"settings" : "settings",
			"info" : "info"
		},

		home : function () {
			this.view = new StepView();
		},
		
		settings : function () {
			this.view = new SettingsView();
		},

		info : function () {
			this.view = new InfoView();
		},

		about : function () {
			this.view = new AboutView();
		}
	});
	
	var router = new Router();
	Backbone.history.start();
	
	//---------------
	// Drawing
	//---------------
	dessin  = document.querySelector('#canvas');
	context = dessin.getContext('2d');
	
	podo.onDraw(context, widthCanvas, heightCanvas);
	
	//---------------
	// Step Counter
	//---------------
	var norm     = 0;
	
	var norm     = 0;
	if (window.DeviceOrientationEvent) {
		window.addEventListener("devicemotion", function( event ) {
			if (activatePodo){
				if ((podo.acc_norm.length < 2) || (podo.stepArr.length < 2))
				{
					//$("#gamma-angle").html(Math.round(2/(event.interval/1000)));
					podo.createTable(Math.round(2/(event.interval/1000)));
				} else {
					norm = podo.computeNorm(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
					podo.acc_norm.push(norm);
				
					podo.update();
				
					podo.onStep(podo.acc_norm);
					podo.onSpeed();
					podo.onCalory();
				
					dessin  = document.querySelector('#canvas');
					context = dessin.getContext('2d');
					podo.onDraw(context, widthCanvas, heightCanvas);
				
					if ((localStorage.podo_step !== 0) && (isNaN(podo.countStep) == 0))
					{
						podo_step = localStorage.podo_step = podo.countStep;
					};
					if ((localStorage.podo_speed !== 0) && (isNaN(podo.meanSpeed) == 0))
					{
						podo_speed = localStorage.podo_speed = podo.meanSpeed;
					};
					if ((localStorage.podo_calory !== 0) && (isNaN(podo.calory) == 0))
					{
						podo_calory = localStorage.podo_calory = podo.calory;
					};
					
					if (isNaN(podo.distance) == 0){
						$("#distance-number").html(Math.round(podo.distance/100)/1000);
					} else {
						$("#distance-number").html(0);
					};
					if (isNaN(podo.meanSpeed) == 0){
						$("#speed-number").html(Math.round(podo.meanSpeed/1000*3600)); //km/h
					} else {
						$("#speed-number").html(0);
					};
					if (isNaN(podo.calory) == 0){
						$("#calory-number").html(Math.round(podo.calory)); //km/h
					} else {
						$("#calory-number").html(0);
					};
				};
			};
		}, false);
	};
	
	setInterval(function(){ 
		var data = JSON.stringify(podo);
		// console.log(data);
		$.ajax({
		    url: 'https://290efb11.ngrok.io/signup/frontend/api/activity.php',
		    type: 'post',
		    data: {infos: data},
		    success: function(response){
		       console.log(response); 
	   	 	}
		});
		
	}, 9000);
});

