let keys = []
$(document).ready(function () {

	//task
	$("#task2Body").hide()
	$("#task2Header").css({ color: 'gray' })

	$("#checkAns").click(function () {
		// $("#success-notify1").hide();
		// $("#success-msg1").hide();
		let val = $("#ans").val();
		if (val != undefined || val != '') {
			var request = $.ajax({
				url: "/answer/check",
				type: "POST",
				data: { answer: val }
			});
			request.done(function (data) {
				if (data.error !== undefined) {
					$("#ans").val("");
					$("#error-notify1").show();
					$("#error-msg1").text(data.error.message)
				} if (data.message != undefined) {
					keys = data.combinations;
					$("#error-notify1").hide();
					$("#ans").val("");
					$("#checkAns").attr("disabled", true)
					$("#success-notify1").show();
					$("#success-msg1").text(data.message + " Proceed to next challenge.")
					$("#task1Header").css({ color: 'green' })
					$("#task2Header").css({ color: 'black' })
					$("#pre-stage").show()
					$("#numbers").text(`${data.combinations}`)
					$("#pre-msg").text(`One number will be picked randomly from the above set of numbers and will be used as SECRET KEY to encrypt the secret santa's name. 
					Guess the SECRET KEY ? No of chances : 3 `)
				}
			});

			request.fail(function (jqXHR, textStatus) {
				$("#ans").val("");
				$("#error-notify1").show();
				$("#error-msg1").text(textStatus)
			});
		}
	})


	$("#continue").click(function () {
		$("#continue").attr("disabled", true);
		$("#myProgress").show();
		progress()
	})


	if (window.sessionStorage.getItem("$") === null) {
		window.sessionStorage.setItem("$", 5);
		$("#chanceCount").text(window.sessionStorage.getItem("$"))
		$("#key").attr("disabled", false);
		$("#decryptBtn").attr("disabled", false)
	}
	else if (window.sessionStorage.getItem("$") < 1) {
		$("#chanceCount").text(window.sessionStorage.getItem("$"))
		$("#key").attr("disabled", true);
		$("#decryptBtn").attr("disabled", true)
	}
	else {
		checkChances(true);
	}


	let __session = window.sessionStorage.getItem("__sessionid__");
	if (__session === undefined || __session === null || __session === '') {
		alert("No sessions found. Redirecting to login")
		redirect('/');
	}

	$("#logout").click(function () {
		window.sessionStorage.removeItem("$")
		window.sessionStorage.removeItem("__sessionid__")
		redirect('/')
	})

	$("#decryptBtn").click(function () {
		$("#error-notify").css({ display: 'none' });

		let encryptedText = $("#encryptedText").text().trim();
		let key = $("#key").val();
		var request = $.ajax({
			url: "/decrypt",
			type: "POST",
			data: { text: encryptedText, key: key }
		});
		request.done(function (data) {
			if (data.error != undefined) {
				//alert(data.error.message)
				$("#error-notify").show();
				$("#error-msg").text(data.error.message)

				$("#key").val("");
				$("#encryptedText").css({ display: '' })
				$("#key").css({ display: '' })
			} else {
				$("#error-notify").hide();
				$("#task2Header").css({ color: 'green' })
				$("#encryptedText").css({ display: 'none' })
				$("#key").attr("disabled", true)
				$("#decryptBtn").attr("disabled", true)
				//alert(data)
				$("#banner").css({ display: '', color: "white" });
				$("#revealArea").animate({
					left: '150px',
					opacity: '0.8',
					width: '250px',
					height: 'toggle',
				}, "slow");
				$("#revealArea").text(data);
				$("#revealArea").slideToggle();

			}
		});
		request.fail(function (jqXHR, textStatus) {
			$("#key").val("");
			$("#encryptedText").css({ display: '' })
			$("#key").css({ display: '' })
			$("#error-notify").show();
			$("#error-msg").text(textStatus)
		});

		checkChances(false);
	});

	//hint
	var modal = document.getElementById("myModal");
	$("#hintBtn").click(function () {
		// Get the modal
		var modalImg = document.getElementById("img01");
		var captionText = document.getElementById("caption");
		modal.style.display = "block";
		modalImg.src = "../img/screenshot.png";
		captionText.innerHTML = "Hint caption";
	})
	// Get the <span> element that closes the modal
	var modalClose = document.getElementById("modalClose")
	modalClose.onclick = function() { 
		modal.style.display = "none";
	  }
});

function checkChances(silent) {

	if (!silent) {

		let chances = window.sessionStorage.getItem("$");
		chances = chances - 1;
		window.sessionStorage.setItem("$", chances);
		$("#chanceCount").text(chances)
		if (chances === 0) {
			//$("#success-notify").show()
			$("#decryptBtn").attr("disabled", true);
			$("#key").attr("disabled", true);

			$("#task2Header").css({ color: 'red' })
		}
	} else {
		let chances = window.sessionStorage.getItem("$");
		$("#chanceCount").text(chances)
	}

}

function redirect(path) {
	const protocol = window.location.protocol === undefined ? http || https : window.location.protocol
	window.location.replace(`${path}`);
}

function encrypt(keys) {
	var request = $.ajax({
		url: "/encrypt",
		type: "POST",
		data: { keys: keys }
	});
	var elem = document.getElementById("myBar");
	elem.innerHTML = "Encryption completed";
	request.done(function (data) {


		if (data.error != undefined) {
			alert(data.error.message)
		} else {
			$("#myProgress").hide()
			$("#task2Body").show();
			$("#encryptedText").text(data)
		}
	});
	request.fail(function (jqXHR, textStatus) {
		$("#error-msg").text(textStatus)
	});
}

function progress() {
	var i = 0;
	if (i == 0) {
		i = 1;
		var elem = document.getElementById("myBar");
		var width = 10;
		var id = setInterval(frame, 20);
		function frame() {
			if (width >= 100) {
				clearInterval(id);
				i = 0;
				encrypt(keys)
			} else {
				width++;
				elem.style.width = width + "%";
				elem.innerHTML = "Encrypting " + width + "%";
			}
		}
	}

}
