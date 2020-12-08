
// popup主动发消息给content-script
var seached = ''
var replaced = ''
var title = ''

chrome.storage.local.get(['s', 'r', 't'], function(res) {
	$('#st').text(res.s)
	$('#rt').text(res.r)
	$('#tt').text(res.t)
	seached = res.s
	replaced = res.r
	title = res.t
})

$('#seached').click(() => {
	var preS = seached
	var curS = prompt('填写需要被替换的目标文本', seached)
	seached = curS || preS
	$('#st').text(seached)
});

$('#replaced').click(() => {
	var preR = replaced
	var curR = prompt('填写替换后需要显示的文本', replaced)
	replaced = curR || preR
	$('#rt').text(replaced)
});

$('#title').click(() => {
	var preT = title
	var curT = prompt('填写替换后需要显示的网页标题', title)
	title = curT || preT
	$('#tt').text(title)
});

$('#submitText').click(() => {
	if (seached && replaced) {
		sendMsg({
			cmd: 'text',
			seached: seached,
			replaced: replaced,
		});
	} else {
		alert('替换和被替换的文本都需要填写')
	}
});

$('#submitTitle').click(() => {
	if (title) {
		sendMsg({
			cmd: 'title',
			title: title,
		});
	} else {
		alert('需要填写替换后显示的网页标题')
	}
});

function sendMsg(message, callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}