
$(document).ready(function () {
	window.resizeTo(451, 523);
	window.sessionStorage.removeItem('__sessionid__');
	$("#logout").css({display: 'none'})
	//login
	$('#loginBtn').click(function () {
		$("#loginBtn").attr("disabled", true)
		$("#loginBtn").text("Logging in..")
		var username = $("#username").val();
		var password = $("#password").val();
		var request = $.ajax({
			url: "/login",
			type: "POST",
			data: { username: username, password: password }
		});
		sleep(2000);
		request.done(function (data) {
			if (data.error != undefined) {
				$("#error-notify").css({ display: '' });
				$("#error-msg").text(data.error.message)
				$("#loginBtn").attr("disabled", false)
				$("#loginBtn").text("Login")
			} else {
				window.sessionStorage.setItem('__sessionid__', data.__session);
				$("#loginBtn").attr("disabled", false)
				$("#loginBtn").text("Login")
				redirect('/home');
			}
		});

		request.fail(function (jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});
	})
});

function redirect(path) {
	const protocol = window.location.protocol === undefined ? http || https : window.location.protocol
	window.location.replace(`${path}`);
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
	  if ((new Date().getTime() - start) > milliseconds){
		break;
	  }
	}
  }
