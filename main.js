function search() {
    var UTCs = ["UTC-12", "UTC-11", "UTC-10", "UTC-09:30", "UTC-09", "UTC-08", "UTC-07", "UTC-06", "UTC-05", "UTC-04:30", "UTC-04", "UTC-03:30", "UTC-03", "UTC-02:30", "UTC-02", "UTC-01", "UTC", "UTC+01", "UTC+02", "UTC+03", "UTC+03:30", "UTC+04", "UTC+04:30", "UTC+05", "UTC+05:30", "UTC+05:45", "UTC+06", "UTC+06:30", "UTC+07", "UTC+08", "UTC+08:45", "UTC+09", "UTC+09:30", "UTC+10", "UTC+10:30", "UTC+11", "UTC+11:30", "UTC+12", "UTC+12:45", "UTC+13", "UTC+13:45", "UTC+14"];
    var UTCCities = ["Baker Island", "Jarvis Island", "Honolulu", "Marquesas Islands", "Anchorage", "Los Angeles", "Phoenix", "Chicago", "New York", "Caracas", "Santiago", "St. John's", "Buenos Aires", "Newfoundland", "Fernando de Noronha", "ittoqqortoormiit", "London", "Belgrade", "Athens", "Nairobi", "Tehran", "Dubai", "Kabul", "Karachi", "Dehli", "Kathmandu", "Dhaka", "Yangon", "Jakarta", "Perth", "Eucla", "Tokyo", "Adelaide", "Canberra", "Lord Howe Island", "Vladivostok", "Norfolk Island", "Auckland", "Chatham Islands", "Samoa", "Chatham Islands", "Line Islands"];
    var firstCity, secondCity;
    var hiddenTimeDiv = document.getElementById("timeInput").innerHTML;
    var hiddenampm = document.getElementById("ampmController").innerHTML;
    var inputTime = 0;
    var date = new Date();
    var currentTime = date.getTime();
    var currentOffset = date.getTimezoneOffset() * 60000;
    currentTime = (currentTime + currentOffset) / 1000;
    //determine input values
    if (document.getElementsByClassName('firstCityInputs')[0].style.display === 'none') {
        firstCity = document.getElementById('timezoneButton').value.substr(document.getElementById('timezoneButton').value.indexOf('UTC'), 12);
        var currentUTC = UTCs.indexOf(firstCity);
        firstCity = UTCCities[currentUTC];

    } else {
        firstCity = encodeURIComponent(document.getElementById("firstCity").value);
    }
    if (document.getElementsByClassName('secondCityInputs')[0].style.display === 'none') {
        secondCity = document.getElementById('timezoneButton2').value.substr(document.getElementById('timezoneButton2').value.indexOf('UTC'), 12);
        var currentUTC2 = UTCs.indexOf(secondCity);
        secondCity = UTCCities[currentUTC2];

    } else {
        secondCity = encodeURIComponent(document.getElementById("secondCity").value);
    }
    //determine Time from hidden inputs
    if (hiddenTimeDiv === "12" && hiddenampm === "AM") {
        inputTime = 0;
    } else if (hiddenampm === "AM" || (hiddenTimeDiv === "12" && hiddenampm === "PM")) {
        inputTime = hiddenTimeDiv * 3600000;
    } else {
        inputTime = (parseInt(hiddenTimeDiv) + 12) * 3600000;
    }
    //begin AJAX call
    $.ajax({
        url: "http://maps.googleapis.com/maps/api/geocode/json?address=" + firstCity + "&sensor=false",
        success: function (data, textStatus, jqXHR) {

            var lat1 = data.results[0].geometry.location.lat;
            var lng1 = data.results[0].geometry.location.lng;
            $.ajax({
                url: "https://maps.googleapis.com/maps/api/timezone/json?sensor=false&location=" + lat1 + "," + lng1 + "&timestamp=" + currentTime,
                success: function (data1, textStatus, jqXHR) {
                    var firstCityTimeZone = data1.timeZoneName;
                    var firstCityTime = currentTime + (data1.dstOffset + data1.rawOffset);
                    $.ajax({
                        url: "http://maps.googleapis.com/maps/api/geocode/json?address=" + secondCity + "&sensor=false",
                        success: function (data2, text, jqXHR) {
                            var lat2 = data2.results[0].geometry.location.lat;
                            var lng2 = data2.results[0].geometry.location.lng;
                            $.ajax({
                                url: "https://maps.googleapis.com/maps/api/timezone/json?sensor=false&location=" + lat2 + "," + lng2 + "&timestamp=" + currentTime,
                                success: function (data3, text, jqXHR) {
                                    var secondCityTimeZone = data2.timeZoneName;
                                    var secondCityTime = currentTime + (data3.dstOffset + data3.rawOffset);
                                    var totalOffsetTime = inputTime + (secondCityTime * 1000 - firstCityTime * 1000);
                                    totalOffsetTime = Math.abs(totalOffsetTime / 1000 / 60 / 60);

                                    var answer;
                                    if (totalOffsetTime === 36) {
                                        answer = "12 PM next day";
                                    } else
                                    if (totalOffsetTime > 36) {
                                        answer = (totalOffsetTime - 36) + " PM next day";
                                    } else
                                    if (totalOffsetTime === 24) {
                                        answer = "12 AM next day";
                                    } else
                                    if (totalOffsetTime > 24) {
                                        answer = (totalOffsetTime - 24) + " AM next day";
                                    } else 
                                    if (totalOffsetTime > 12) {
                                        answer = (totalOffsetTime - 12) + " PM";
                                    } else 
                                    if (totalOffsetTime === 12) {
                                    	answer = "12 PM";
                                    } else {
                                        answer = totalOffsetTime + " AM";
                                      }
									$('#hideOnConvert').hide();
                                    document.getElementById("results").innerHTML = answer;
                                }    
                            });
                        }
                    });
                }
            });
        }
    });
    document.getElementById('timezoneButton').value = '';
    document.getElementById('timezoneButton2').value = '';
}