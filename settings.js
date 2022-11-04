let defaultSettings = {
	fontSize: 32,
	opacity: 0.8,
	leftHeight: 42,
	leftXOffset: 25,
	leftYOffset: 0,
	leftStyle: 'A-E',
	bottomWidth: 45,
	bottomXOffset: 0,
	bottomYOffset: 20,
	bottomStyle: '1-9',
};

function populateForm(data) {
	Object.keys(defaultSettings).forEach((id) => {
		document.getElementById(id).value = data[id];
	});
}

function notifyTab(settings) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { settings });
	});
}

async function save() {
	let newSettings = {};
	Object.keys(defaultSettings).forEach((id) => {
		let val = document.getElementById(id).value;
		newSettings[id] = val === '' ? defaultSettings[id] : val;
	});
	localStorage.setItem('settings', JSON.stringify(newSettings));
	notifyTab(newSettings);
}

function reset() {
	populateForm(defaultSettings);
	save();
}

document.addEventListener('DOMContentLoaded', function () {
	let loaded = localStorage.getItem('settings' ?? '{}');
	let settings = { ...defaultSettings, ...JSON.parse(loaded) };
	populateForm(settings);

	let ctrls = document.querySelectorAll('input, select');
	for (let el of ctrls) {
		el.onchange = save;
	}

	document.getElementById('reset').onclick = reset;
});
