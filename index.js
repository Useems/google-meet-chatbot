// Sample Code

function onMessage(data) {
	let prefix = data.message.slice(0, 1);
	let splitted = data.message.slice(1).toLowerCase().split(' ');
	
	if (prefix == '.') {
		switch (splitted[0]) {
			case 'ping':
				sendMessage('Pong!');
				break;
			case 'calc':
				let expression = splitted.slice(1).join('').replace(/[^-()\d/*+.]/g, '');
				let value = eval(expression); 
				
				if (value)
					sendMessage('Expression:  ', expression, '\nResult: ', value);
				break;
			case 'hi':
				sendMessage('Hello, ', data.username, '!');
				break;
			case 'invite':
				sendMessage('Invite URL: ', window.location.href.split('?')[0]);
				break;
			default:
				break;
		}
	}
}

// Framework Code

(() => {
	let messagesLength = -1;
	let lastMessageLength = -1;

	window.sendMessage = function(...args) {
		let message = document.querySelector('div > div > div:nth-child(4) > div > div > div > div > div > div > span:nth-child(2) > div > div > div > div > div > textarea');
		let button = document.querySelector('div > div > div:nth-child(4) > div > div > div > div > div > div > span:nth-child(2) > div > div:nth-child(3) > div:nth-child(2)');
		
		if (message && button) {
			message.value = args.join('');
			button.ariaDisabled = null
			button.click();
			
			return message.value == '';
		}
		
		return false;
	}

	if (window.messagesInterval)
		try {
			clearInterval(messagesInterval)
		} catch (err) {}

	window.messagesInterval = setInterval(() => {
		var messages = document.querySelector('div > div > div:nth-child(4) > div > div > div > div > div > div > span:nth-child(2) > div > div').childNodes;
		
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

				if (onMessage && typeof(onMessage) == 'function') {
					onMessage({
						username: message.dataset.senderName,
						message: messageText,
						date: parseInt(message.dataset.timestamp)
					});
				}
			}
		}
	}, 100);
})();
