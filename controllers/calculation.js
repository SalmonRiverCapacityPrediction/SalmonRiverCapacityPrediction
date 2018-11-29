var porbabilityOfCapture = (sweep_number,fish_caught,cumulative_number) => {
	var k = parseFloat(sweep_number);
	console.log("K is: ", k);
	var t = parseFloat(fish_caught);
	var x = parseFloat(cumulative_number);
	var numerator = parseFloat(-(3*k*t*x - 3*t*3*x));
	console.log("Numer: ", numerator);
	var denominator = parseFloat((k*3*x*x - (3*x)*(3*x)));
	console.log("Denom: ", denominator);
	var p = parseFloat(numerator/denominator);
	console.log(p);
	return p;
}

var nNumber = (sweep_number, fish_caught,cumulative_number) => {
	//var p = parseFloat(porbabilityOfCapture(sweep_number,fish_caught,cumulative_number));
	//console.log("Probab: ", p);
	var p = -0.5208
	var k = parseFloat(sweep_number);
	var t = parseFloat(fish_caught);
	var x = parseFloat(cumulative_number);
	var n = parseFloat((3*t + p*3*x))/parseFloat(k*p);
	return n;
}



module.exports ={	
	nNumber
};