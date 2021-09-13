(() => {
	let messagesLength = -1;
	let lastMessageLength = -1;
	let events = {};
	
	window.chatbot = {
		sendMessage: function(...args) {
			let message = document.querySelector("*[name=\"chatTextInput\"]");
			let button = message.parentElement.parentElement.parentElement.parentElement.children[1].querySelector('button'); // Best way I found
            button.disabled = false;
			
			if (message && button) {
				let lastValue = message.value + "";
				message.value = args.join("");

				button.ariaDisabled = null
				button.click();
				
				let success = message.value === "";
				message.value = lastValue;
				
				return success;
			}
			
			return false;
		},
		on: function(event, f) {
			if (!events[event] && typeof(f) == "function")
				events[event] = f
		},
		emit: function(event, ...args) {
			if (events[event])
				events[event](...args);
		}
	}

	if (window.messagesInterval)
		try {
			clearInterval(messagesInterval);
		} catch (err) {}

	window.messagesInterval = setInterval(() => {
		var messages = document.querySelectorAll('[data-sender-name]');

		if (messages) {
			if (messages.length > 0)
				var message = messages[messages.length - 1];

			if (messagesLength === -1) {
				messagesLength = messages.length;
				lastMessageLength = message ? message.childNodes[1].childNodes.length : 0;
			} else if (messagesLength != messages.length || (message && lastMessageLength != message.childNodes[1].childNodes.length)) {
				let messageText = message.childNodes[1].childNodes[message.childNodes[1].childNodes.length - 1].dataset.messageText;

				messagesLength = messages.length;
				lastMessageLength = message.childNodes[1].childNodes.length;

				window.chatbot.emit("message", message.dataset.senderName, messageText, parseInt(message.dataset.timestamp));
			}
		}
	}, 100);
})();

// Sample
var prefix = '.';

chatbot.on("message", (username, message, date) => {
	let m_prefix = message.slice(0, prefix.length);
	let splitted = message.slice(prefix.length).toLowerCase().split(' ');
	
	if (m_prefix === prefix) {
		switch (splitted[0]) {
			case "ping":
				chatbot.sendMessage("Pong!");
				break;
			case "calc":
				let expression = splitted.slice(1).join("").replace(/[^-()\d/*+.]/g, "");
				let value = eval(expression); 
				
				if (value)
					chatbot.sendMessage("Expression:  ", expression, "\nResult: ", value);
				break;
			case "hi":
				chatbot.sendMessage("Hello, ", username, '!');
				break;
			case "invite":
				chatbot.sendMessage("Invite URL: ", window.location.href.split('?')[0]);
				break;
			default:
				chatbot.sendMessage("Command not found.");
				break;
		}
	}
});
