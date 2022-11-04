let defaultSettings = {
	fontSize: 30,
	opacity: 0.8,
	leftHeight: 40,
	leftXOffset: 25,
	leftYOffset: 0,
	leftStyle: 'A-E',
	bottomWidth: 45,
	bottomXOffset: 0,
	bottomYOffset: 20,
	bottomStyle: '1-9',
};

function notationExists() {
	return document.querySelectorAll('.notation').length > 0;
}

function removeNotation() {
	let notations = document.querySelectorAll('.notation');
	for (div of notations) {
		div.remove();
	}
}

function buildNotation() {
	chrome.storage.local.get(['settings'], function (result) {
		let settings = { ...defaultSettings, ...(result?.settings ?? {}) };
		buildLeft(settings);
		buildBottom(settings);
	});
}

let leftStyles = {
	'A-E': 'ABCDE'.split(''),
	'a-e': 'abcde'.split(''),
	'1-5': '12345'.split(''),
	'0-4': '01234'.split(''),
	'-2-2': '-2,-1,0,1,2'.split(','),
};
let bottomStyles = {
	'A-I': 'ABCDEFGHI'.split(''),
	'a-i': 'abcdefghi'.split(''),
	'1-9': '123456789'.split(''),
	'0-8': '012345678'.split(''),
	'-4-4': '-4,-3,-2,-1,0,1,2,3,4'.split(','),
};

function buildLeft(settings) {
	let div = document.createElement('div');
	div.className = 'notation left-notation';
	document.body.appendChild(div);

	let inner = document.createElement('div');
	div.appendChild(inner);

	for (let x of leftStyles[settings.leftStyle]) {
		let item = document.createElement('div');
		item.textContent = x;
		inner.appendChild(item);
	}

	Object.assign(div.style, {
		pointerEvents: 'none',
		position: 'fixed',
		zIndex: 9999,
		left: settings.leftXOffset + 'vw',
		top: settings.leftYOffset + 'vh',
		fontSize: settings.fontSize + 'px',
		opacity: settings.opacity,
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: settings.leftSpacing + 'px',
		transform: 'skewX(-10deg)',
		color: 'white',
		textShadow: 'black 0 0 12px',
	});
	Object.assign(inner.style, {
		height: settings.leftHeight + 'vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	});
}

function buildBottom(settings) {
	let div = document.createElement('div');
	div.className = 'notation bottom-notation';
	document.body.appendChild(div);

	let inner = document.createElement('div');
	div.appendChild(inner);

	for (let x of bottomStyles[settings.bottomStyle]) {
		let item = document.createElement('div');
		item.textContent = x;
		inner.appendChild(item);
	}

	Object.assign(div.style, {
		pointerEvents: 'none',
		position: 'fixed',
		zIndex: 9999,
		left: settings.bottomXOffset + 'vw',
		bottom: settings.bottomYOffset + 'vh',
		fontSize: settings.fontSize + 'px',
		opacity: settings.opacity,
		width: '100vw',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white',
		textShadow: 'black 0 0 12px',
	});
	Object.assign(inner.style, {
		width: settings.bottomWidth + 'vw',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	});
}

chrome.runtime.onMessage.addListener(function (request) {
	if (request.type === 'settings updated') {
		removeNotation();
		buildNotation();
	}
});

setInterval(() => {
	let game = document.getElementById('app-game');
	if (game) {
		let chooseHand = document.getElementById('app-game-choose-hand');
		if (!chooseHand && !notationExists()) {
			buildNotation();
		}
	} else {
		removeNotation();
	}
}, 250);

// document.addEventListener('keydown', function toggle(keyEvent) {
// 	if (keyEvent.key !== 'n') {
// 		return;
// 	}
// });
