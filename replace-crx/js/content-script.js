console.log('@replace-crx')

function replaceBodyText(searchWord, replaceWord){
    var reg = new RegExp(searchWord, 'g');
    function replaceNode(node){
        node.childNodes.forEach(function(v){
            if(v.nodeName === 'SCRIPT') return; //排除<script>标签
            if(!v.hasChildNodes()){
                if(reg.test(v.textContent))
                    v.textContent = v.textContent.replace(reg, replaceWord);
                return;
            }
            replaceNode(v);
        });
    }
    replaceNode(document.body);
}

function repalceText(searchs, replaces) {
	if (searchs && replaces) {
		chrome.storage.local.set({ s: searchs })
		chrome.storage.local.set({ r: replaces })
		var sArr = searchs.split(',')
		var rArr = replaces.split(',')
		for (let i = 0; i < sArr.length; i++) {
			replaceBodyText(sArr[i], rArr[i])
		}
	}
}

function replaceTitle(title) {
	if (title) {
		chrome.storage.local.set({ t: title })
		document.title = title
	}
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get(['s', 'r', 't'], function(res) {
		repalceText(res.s, res.r)
		replaceTitle(res.t)
	})
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.cmd === 'text') {
		repalceText(request.seached, request.replaced)
	}
	if (request.cmd === 'title') {
		replaceTitle(request.title)
	}
});