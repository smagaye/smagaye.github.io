/*This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

function Kalman() {
	this.G  = 1; // filter gain
	this.Rw = 1; // noise power desirable
	this.Rv = 10; // noise power estimated
	
	this.A = 1;
	this.C = 1;
	this.B = 0;
	this.u = 0;
	this.P = NaN;
	this.x = NaN; // estimated signal without noise
	this.y = NaN; //measured
		

	this.onFilteringKalman = function(ech)//signal: signal measured
	{
		this.y = ech;
		
		if (isNaN(this.x)) {
			this.x = 1/this.C * this.y;
			this.P = 1/this.C * this.Rv * 1/this.C;
		} 
		else {
			// Kalman Filter: Prediction and covariance P
			this.x = this.A*this.x + this.B*this.u;
			this.P = this.A * this.P * this.A + this.Rw;
			// Gain
			this.G = this.P*this.C*1/(this.C*this.P*this.C+this.Rv);
			// Correction
			this.x = this.x + this.G*(this.y-this.C*this.x);
			this.P = this.P - this.G*this.C*this.P;
		};
		return this.x;
	};	
	
	this.setRv = function(Rv)//signal: signal measured
	{
		this.Rv = Rv;
	};
};

function Pedometer() {
	this.acc_norm = new Array(); // amplitude of the acceleration 
	
	this.var_acc   = 0.; // variance of the acceleration on the window L
	this.min_acc   = 1./0.;  // minimum of the acceleration on the window L
	this.max_acc   = -1./0.; // maximum of the acceleration on the window L
	this.threshold = -1./0.; // threshold to detect a step
	this.sensibility = 1./30.;  // sensibility to detect a step
	
	this.countStep = 0;           // number of steps
	this.stepArr   = new Array(); // steps in 2 seconds
	
	this.weight    = 70; // weight of the pedestrian
	this.stepSize  = 50; // step size of the pedestrian (cm)
	this.distance  = 0;  // total distance (cm)
	this.calory    = 0;  // calory burned (C)
	this.speed     = 0;  // instantaneous speed of the pedestrian (m/s)
	this.meanSpeed = 0;  // mean speed of the pedestrian (m/s)
	
	this.isGPSEnabled  = false; //enable GPS measurement
	this.isGPSReceived = false; //GPS receives data
	this.GPSposition; // GPS data
	this.GPSlat = 0;
	this.GPSlon = 0;
	this.GPStimeSt = 0;
	this.distGPS = 0; // distance between 2 acquisitions
	this.timeGPS = 0; // duration between 2 acquisitions
	this.idGPS = 0; // GPS handler
	
	this.filtre = new Kalman();
	
	this.setCountStep = function(count) {
		this.countStep = count;
	};
	
	this.setWeight = function(weight) {
		this.weight = weight;
	};
	
	this.setStepSize = function(stepSize) {
		this.stepSize = stepSize;
	};
	
	this.setMeanSpeed = function(meanSpeed) {
		this.meanSpeed = meanSpeed;
	};
	
	this.setCalory = function(calory) {
		this.calory = calory;
	};
	
	this.setSensibility = function(sensibility) {
		this.sensibility = sensibility;
	};
	
	this.setIsGPSEnabled = function(isGPSEnabled) {
		this.isGPSEnabled = isGPSEnabled;
	};
	
	this.setIsGPSReceived = function(isGPSReceived) {
		this.isGPSReceived = isGPSReceived;
	};
	
	this.setGPSposition = function(GPSposition) {
		this.GPSposition = GPSposition;
	};
	
	this.setGPSlat = function(GPSlat) {
		this.GPSlat = GPSlat;
	};
	
	this.setGPSlon = function(GPSlon) {
		this.GPSlon = GPSlon;
	};
	
	this.setGPStimeSt = function(GPStimeSt) {
		this.GPStimeSt = GPStimeSt;
	};
	
	this.setIdGPS = function(idGPS) {
		this.idGPS = idGPS;
	};
	
	// initialization of arrays
	this.createTable = function(lWindow) {
		this.acc_norm = new Array(lWindow); 
		this.stepArr = new Array(lWindow); 
	};

	// update arrays
	this.update = function() {
		this.acc_norm.shift();
	};
	
	// compute norm of the acceleration vector	
	this.computeNorm = function(x,y,z) {
		var norm = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
		var norm_filt = this.filtre.onFilteringKalman(norm);
		
		return norm_filt/9.80665;
	}; 
	
	// seek variance
	this.varAcc = function(acc) {
		var moy  = 0.;//mean
		var moy2 = 0.;//square mean
		for (var k = 0; k < acc.length-1; k++) {
			moy += acc[k];
			moy2 += Math.pow(acc[k],2);
		};
		this.var_acc = (Math.pow(moy,2) - moy2)/acc.length;
		if (this.var_acc - 0.5 > 0.) {
				this.var_acc -= 0.5; 
		};		
		if (isNaN(this.var_acc) == 0) {
			this.filtre.setRv(this.var_acc);
			this.setSensibility(2.*Math.sqrt(this.var_acc)/Math.pow(9.80665,2));
		}
		else {
			this.setSensibility(1./30.);
		};
	};
	
	// seek minimum
	this.minAcc = function(acc) {
		var mini = 1./0.;
		for (var k = 0; k < acc.length; k++) {
			if (acc[k] < mini)
			{
				mini = acc[k];
			};
		};
		return mini;
	};
	
	// seek maximum
	this.maxAcc = function(acc) {
		var maxi = -1./0.;
		for (var k = 0; k < acc.length; k++) {
			if (acc[k] > maxi)
			{
				maxi = acc[k];
			};
		};
		return maxi;
	};
	
	// compute the threshold
	this.setThreshold = function(min, max) {
		this.threshold = (min+max)/2;
	};
	
	// detect a step
	this.onStep = function(acc) {	
		this.varAcc(acc);
		this.min_acc = this.minAcc(acc);
		this.max_acc = this.maxAcc(acc);
		
		this.setThreshold(this.min_acc, this.max_acc);
		
		var diff = this.max_acc - this.min_acc;
		
		var isSensibility   = (Math.abs(diff) >= this.sensibility)// the acceleration has to go over the sensibility
		var isOverThreshold = ((acc[acc.length-1] >= this.threshold) && (acc[acc.length-2] < this.threshold));// if the acceleration goes over the threshold and the previous was below this threshold
		var isValidStep     = (this.stepArr[this.stepArr.length-1] == 0);
		
		if (isSensibility && isOverThreshold && isValidStep) {
			this.countStep++;
			this.stepArr.push(1);
			this.stepArr.shift();

			// Distance
			if (Boolean(this.isGPSEnabled) && Boolean(this.isGPSReceived)) {
				this.setDistanceGPS();
				var nStepGPS = Math.round(this.distance/this.countStep);
				if (this.countStep < nStepGPS) {
					this.countStep = nStepGPS;
				};
			} else {
				this.setDistance();
			};
		} else {
			this.stepArr.push(0);
			this.stepArr.shift();
		};
	};
	
	// Compute total distance
	this.setDistance = function() {
		this.distance = this.countStep * this.stepSize;//cm
	};
	
	this.setDistanceGPS = function() {
		var lat1 = this.GPSposition[0].coords.latitude*Math.PI/180.,
			lat2 = this.GPSposition[1].coords.latitude*Math.PI/180.,
			lon1 = this.GPSposition[0].coords.longitude*Math.PI/180.,
			lon2 = this.GPSposition[1].coords.longitude*Math.PI/180.;
				
		this.distGPS = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon1-lon2));
		
		this.timeGPS = Math.abs(this.GPSposition[0].timestamp - this.GPSposition[1].timestamp);
			
		if ((isNaN(this.distance) == 0) && (isNaN(this.distGPS) == 0)){
			if  (this.timeGPS <= 60000) {
				this.distance = this.distance + this.distGPS;
			};
		} else {
			this.distance = this.distGPS;
		};
	};
	
	// Compute instantaneous speed on 2 seconds
	this.onSpeed = function() {
		var stepin2s = 0;
		this.speed = 0;
		for (var k = 0; k < this.stepArr.length ; k++) {
			stepin2s += this.stepArr[k];
		};
		var distin2s = stepin2s * this.stepSize;
		var speedAcc = (distin2s/100.)/2.; //m/s
		
		
		var speedGPS = 0;
		if (Boolean(this.isGPSEnabled) && Boolean(this.isGPSReceived)) {
			if ((this.timeGPS < 6000) && (isNaN(this.distGPS) == 0)  && (isNaN(speedAcc) == 0) && (isNaN(this.timeGPS) == 0)){
				if (this.timeGPS > 0) {
					speedGPS = this.distGPS / this.timeGPS;
				};			
				this.speed = (speedGPS + speedAcc)/2;
			};
		} else {
			this.speed =  speedAcc;
		};
		$('#speed-number').html(this.countStep + ' ' + speedAcc + ' ' + this.speed);
		
		// Mean Speed
		if ((this.stepArr[this.stepArr.length-1] !== 0) && ((this.speed !== 0) && (isNaN(this.speed) == 0))) {
			if (isNaN(this.meanSpeed) == 0){
				this.meanSpeed = (this.meanSpeed * (this.countStep-1) + this.speed)/this.countStep;
			} else {
				this.meanSpeed = this.speed;
			};
		};
	};
	
	// Compute calories burned
	this.onCalory = function() {
		if ((isNaN(this.speed) == 0) && (isNaN(this.calory) == 0)) {
			this.calory += this.speed * this.weight / 400;
		};
	};
	
	// Drawing
	this.onDraw = function(context, widthCanvas, heightCanvas) {
		context.clearRect(0, 0, widthCanvas, heightCanvas);
		
		var vitesseLimite = 15;
		//Circle
		var radiusCircle = heightCanvas/2*5/6;
		var angleCanvas  = (Math.PI / 180) * 150;
		context.lineWidth = 1;
		context.save();
		context.beginPath();
		context.arc(widthCanvas/2, heightCanvas/2, radiusCircle, (Math.PI / 180) * 150, (Math.PI / 180) * 30); 
		context.stroke();
	
		//Line
		for (var k = 0 ; k <= vitesseLimite ; k++) {
			context.beginPath();
			angleCanvas = (Math.PI / 180) * (150 + k * 240/vitesseLimite);
			if (k%5 == 0){
				context.font = "bold 16pt Calibri,Geneva,Arial";
				context.strokeStyle = "rgb(0, 128, 128)";
				context.fillText(k, widthCanvas/2+radiusCircle*1.1*Math.cos(angleCanvas)-context.measureText(k).width/2, heightCanvas/2+radiusCircle*1.1*Math.sin(angleCanvas));
			} else {
				context.strokeStyle = "rgb(0, 0, 0)";
			};
			context.moveTo(widthCanvas/2+radiusCircle/1.05*Math.cos(angleCanvas), heightCanvas/2+radiusCircle/1.05*Math.sin(angleCanvas));  // 1st point
			context.lineTo(widthCanvas/2+radiusCircle*Math.cos(angleCanvas), heightCanvas/2+radiusCircle*Math.sin(angleCanvas));  // 2nd point
			context.stroke();
		};
	
		context.font = "10pt Calibri,Geneva,Arial";
		context.strokeStyle = "rgb(0, 0, 0)";
		context.fillText("km/h", widthCanvas/2-context.measureText("km/h").width/2, heightCanvas*1/3);
		
		//arrow
		context.lineWidth = 5;
	
		context.save();
		context.restore();
		context.beginPath();
		context.strokeStyle = "rgb(0, 0, 0)";
		if (isNaN(this.speed) == 1){
			angleCanvas = (Math.PI / 180) * (150 + 0 * 240/vitesseLimite);
		} else if (this.speed/1000*3600 > vitesseLimite) {
			angleCanvas = (Math.PI / 180) * (150 + vitesseLimite * 240/vitesseLimite);
		} else {
			angleCanvas = (Math.PI / 180) * (150 + Math.round(this.speed/1000*3600) * 240/vitesseLimite);
		};
		context.moveTo(widthCanvas/2, heightCanvas/2);  // 1st point
		context.lineTo(widthCanvas/2+radiusCircle*0.9*Math.cos(angleCanvas), heightCanvas/2+radiusCircle*0.9*Math.sin(angleCanvas));  // 2nd point
		context.stroke();
	
		context.beginPath();
		context.fillStyle = "rgb(0, 128, 128)";
		context.arc(widthCanvas/2+radiusCircle*0.95*Math.cos(angleCanvas), heightCanvas/2+radiusCircle*0.95*Math.sin(angleCanvas), radiusCircle*0.05, 0, 2*Math.PI);
		context.fill();
		
		// Step Number
		context.font = "bold 48pt Calibri,Geneva,Arial";
		context.strokeStyle = "rgb(0, 0, 0)";
		if (isNaN(this.countStep) == 0){
			context.fillText(this.countStep, widthCanvas/2-context.measureText(this.countStep).width/2, heightCanvas*5/6);
		} else {
			context.fillText("Error", widthCanvas/2-context.measureText("Error").width/2, heightCanvas*5/6);
		};
		
		context.restore();
	};
	
	// Get GPS position
	
	
};


function getGPSLocation(lang, podo) {
	// Request a position. We accept positions whose age is not
	// greater than 10 minutes. If the user agent does not have a
	// fresh enough cached position object, it will automatically
	// acquire a new one.

	var id;
	var dataGPS = new Array();
	
	if (podo.isGPSEnabled == true) {
		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 600000
		};

		function successCallback(position) {
			dataGPS.push(position);
			if (dataGPS.length >= 2) {
				podo.setIsGPSReceived(true);
				dataGPS.shift();
			}
			podo.setGPSposition(dataGPS);
// 			podo.setGPSlat(position.coords.latitude);
// 			podo.setGPSlon(position.coords.longitude);
// 			podo.setGPStimeSt(position.timestamp);
	
			$("#coordinates").html(lang.$isGPS + ' (' + position.coords.latitude + ' ; ' + position.coords.longitude + ')');
		};
	
		function errorCallback(error) {
			if (error.code === 1) {
				$("#coordinates").html(lang.$errorGPS1);
			} else if (error.code === 2) {
				$("#coordinates").html(lang.$errorGPS2);
			} else if (error.code === 3) {
				if (dataGPS.length >= 2) {
					if (Math.abs(dataGPS[0].timestamp - dataGPS[0].timestamp) > 6000) {
						$("#coordinates").html(lang.$errorGPS3);
					};
				} else { 
					$("#coordinates").html(lang.$errorGPS3);
				};
			} else {
				$("#coordinates").html(lang.$errorGPS4);
			};
			podo.setIsGPSReceived(false);
		};
		
		id = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
		podo.setIdGPS(id);
	};
};

