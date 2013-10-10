
function search() {
	var hiddenTimeDiv = document.getElementById("timeInput").innerHTML;
	var hiddenampm = document.getElementById("ampmController").innerHTML;
    var inputTime = 0;
    console.log(inputTime);
	var firstCity = encodeURIComponent(document.getElementById("firstCity").value);
	var secondCity = encodeURIComponent(document.getElementById("secondCity").value);
	var date = new Date();
	var currentTime = date.getTime();
	var currentOffset = date.getTimezoneOffset() * 60000;
	currentTime = (currentTime + currentOffset)/1000;

	//determine Time from hidden inputs
	if(hiddenTimeDiv === "12" && hiddenampm === "AM") {
		console.log("12 AM!");
		inputTime = 0; }
		else if (hiddenampm === "AM" || (hiddenTimeDiv === "12" && hiddenampm === "PM")){
			console.log("12 PM or other AMs!");
			inputTime = hiddenTimeDiv * 3600000; }
			else{
				inputTime = (parseInt(hiddenTimeDiv) + 12) * 3600000;
				console.log("XPM!");
}
	//begin AJAX call
	$.ajax({
		url: "http://maps.googleapis.com/maps/api/geocode/json?address="+firstCity+"&sensor=false",
		success: function(data, textStatus, jqXHR) {
			
			var lat1 = data.results[0].geometry.location.lat;
			var lng1 = data.results[0].geometry.location.lng;
			$.ajax({
				url: "https://maps.googleapis.com/maps/api/timezone/json?sensor=false&location=" + lat1 + "," + lng1 + "&timestamp=" + currentTime,
				success: function(data1, textStatus, jqXHR) {
					var firstCityTimeZone = data1.timeZoneName;
					var firstCityTime = currentTime + (data1.dstOffset+data1.rawOffset);
					$.ajax({
						url: "http://maps.googleapis.com/maps/api/geocode/json?address="+secondCity+"&sensor=false",
						success: function(data2, text, jqXHR) {
							var lat2 = data2.results[0].geometry.location.lat;
							var lng2 = data2.results[0].geometry.location.lng;
							$.ajax({
								url: "https://maps.googleapis.com/maps/api/timezone/json?sensor=false&location=" + lat2 + "," + lng2 + "&timestamp=" + currentTime,
								success: function(data3, text, jqXHR) {
									var secondCityTimeZone = data2.timeZoneName;
									var secondCityTime = currentTime + (data3.dstOffset + data3.rawOffset);
									console.log("inputtime: "+inputTime+" firstCityTime: "+firstCityTime+" secondCityTime:" +secondCityTime);
									console.log("timeinput="+inputTime);
									var totalOffsetTime = inputTime + (secondCityTime * 1000 - firstCityTime*1000);
									console.log("tot: "+totalOffsetTime);
									totalOffsetTime = Math.abs(totalOffsetTime/1000/60/60);
									console.log(totalOffsetTime);
									var answer = 0;
									if(totalOffsetTime === 24){
										answer = "12 AM next day";
									} else
									if(totalOffsetTime >= 24){
										answer = (totalOffsetTime - 24) + " AM next day";
									} else {
										if (totalOffsetTime >= 12){
											answer = (totalOffsetTime - 12) + " PM";
										} else {
											answer = totalOffsetTime + " AM";
										}
									}
									console.log("start erasing shit");
									$('#hideOnConvert').hide();
									document.getElementById("results").innerHTML= answer;

								}
							});
							
						}
					});
				}
			});
		}
	});
}
