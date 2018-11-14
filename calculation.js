var porbability_of_capture = (sweep_number,fish_caught,cumulative_number) => {
	var k = sweep_number;
	var t = fish_caught;
	var x = cumulative_number;
	var numerator = -(3*k*t*x - 3*t*3*x)
	var denominator = (k*3*x*x - (3*x)*(3*x));
	var p = numerator/denominator;
	return p;
}

var n_number = (porbability_of_capture, sweep_number, fish_caught,cumulative_number) => {
	var p = porbability_of_capture;
	var k = sweep_number;
	var t = fish_caught;
	var x = cumulative_number;
	var n = (3*t + p*3*x)/k*t;
	return n;
}

module.exports ={
	porbability_of_capture
};