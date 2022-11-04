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

function populateForm(data) {
	Object.keys(defaultSettings).forEach((id) => {
		let el = document.getElementById(id);
		if (el) {
			el.value = data[id];
		}
	});
}

function notifyTab(settings) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs
			.sendMessage(tabs[0].id, { type: 'settings updated' })
			.catch(() => {});
	});
}

async function save() {
	let newSettings = {};
	Object.keys(defaultSettings).forEach((id) => {
		let val = document.getElementById(id).value;
		newSettings[id] = val === '' ? defaultSettings[id] : val;
	});
	chrome.storage.local.set({ settings: newSettings }, function () {
		console.log('Saved');
	});

	notifyTab(newSettings);
}

function reset() {
	populateForm(defaultSettings);
	save();
}

document.addEventListener('DOMContentLoaded', function () {
	chrome.storage.local.get(['settings'], function (result) {
		let settings = { ...defaultSettings, ...(result?.settings ?? {}) };

		populateForm(settings);

		let ctrls = document.querySelectorAll('input, select');
		for (let el of ctrls) {
			el.onchange = save;
		}

		document.getElementById('reset').onclick = reset;
	});
});
