function showStart() {
	$("#content").slideUp();

	window.setTimeout(function() {
		var request = new XMLHttpRequest();
		request.open("GET", "start.html", true);
		request.send();

		request.onreadystatechange = function() {
			if(request.readyState == 4 && request.status == 200) {
				document.getElementById("content").innerHTML = request.responseText;
				$("#content").slideDown();
			}
		}
	}, 500);
}

function showMunkar() {
	$("#content").slideUp();

	window.setTimeout(function() {
		var request = new XMLHttpRequest();
		request.open("GET", "vara_munkar.html", true);
		request.send();

		request.onreadystatechange = function() {
			if(request.readyState == 4 && request.status == 200) {
				document.getElementById("content").innerHTML = request.responseText;
				$("#content").slideDown();
			}
		}
	}, 500);
}

function showabout() {
	$("#content").slideUp();

	window.setTimeout(function() {
		var request = new XMLHttpRequest();
		request.open("GET", "about.html", true);
		request.send();

		request.onreadystatechange = function() {
			if(request.readyState == 4 && request.status == 200) {
				document.getElementById("content").innerHTML = request.responseText;
				$("#content").slideDown();
			}
		}
	}, 500);
}

function showleveransvillkor() {
	$("#content").slideUp();

	window.setTimeout(function(){
		var request = new XMLHttpRequest();
		request.open("GET", "leveransvillkor.html", true);
		request.send();

		request.onreadystatechange = function() {
			if(request.readyState == 4 && request.status == 200) {
				var content = document.getElementById("content");
				content.innerHTML = request.responseText;
				// la till det här
				var scripts = content.getElementsByTagName("script");
				if (scripts.length > 0) {
					eval(scripts[0].innerHTML);
				}
				$("#content").slideDown();
			}
		}
	}, 600);
}

function showContact() {
	$("#content").slideUp();

	window.setTimeout(function() {
		var request = new XMLHttpRequest();
		request.open("GET", "contact.html", true);
		request.send();

		request.onreadystatechange = function() {
			if(request.readyState == 4 && request.status == 200) {
				var content = document.getElementById("content");
				content.innerHTML = request.responseText;
				// la till det här också
				var scripts = content.getElementsByTagName("script");
				if (scripts.length > 0) {
					eval(scripts[0].innerHTML);
				}
				$("#content").slideDown();
			}
		}
	}, 500);
}

function sendForm() {
	if(validatephone()) {

		if(document.getElementById("name").value == "") {
			alert("Ditt meddelande har inte skickats.");
		} else {
			alert("Tack! Ditt meddelande har skickats.");
			window.location.href="index.html";
		}

	} else {
		alert("Ditt meddelande har inte skickats.");
	}

	function validatephone() {
		return validateemail();

		function validateemail() {
			var em = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			var r = em.exec(document.getElementById("email").value);

			if(!r) $("#email").css('outline', '1px solid red');

			if(r) $("#email").css('outline', '2px solid green');

			if(!r) return false;

			else {
				var phonepat = /^([+]46)\s*(7[0236])\s*(\d{4})\s*(\d{3})$/;
				var result = phonepat.exec(document.getElementById("tfn").value);

				if(!result) $("#tfn").css('outline', '1px solid red');

				if(result) $("#tfn").css('outline', '2px solid green');

				if(!result) return false;

				else return true;
			}
		}
	}
}