var IDE = window.IDE = {};

require("./styles/common.css");
require("./styles/editor.css");
require("./styles/tree.css");

//- LOAD CORE -//
import Core from "./src/core"

//- INITIALIZE CORE -//
IDE.Core = new Core([
	"plugins",
	"qParams",
	"toolbar",
	"fileManager",
	"editor"	
]);

IDE.Core.onReady(function(){
	IDE.plugins.onPluginsLoaded(function(){
		IDE.plugins.activate("history");
		IDE.plugins.activate("save");
		IDE.plugins.events.emit("all_activated");
		studio.editor.loaded();
	});

	IDE.plugins.loadMultiple([
		"history",
		"save"
	]);	
});

IDE.loadFile = function(fn) {
	IDE.qParams.path = fn;
	IDE.editor.loadFile();
};

	
IDE.shortcut_plugins_save_save = function() {
	IDE['plugins']['plugins']['save']['code']['save']();
};




IDE.selectByTextOffset = function(start, end) {
	var aceStartPos;
	var aceEndPos;
	var doc = IDE.editor.editor.getSession().getDocument();
	var lines = doc.getAllLines();
	
	function posFromOffset( offsetPos ) {
		var row = 0, col = 0;
		var pos = 0;
		while (row < lines.length && pos + lines[row].length < offsetPos) {
			pos += lines[row].length;
			pos++; // for the newline 0x0D
			row++;
		}
		col = offsetPos - pos;
		return {row: row, column: col};
	}

	aceStartPos = posFromOffset(start);
	aceEndPos = posFromOffset( end );


	// scroll to line firstly
	IDE.editor.editor.resize(true);

	var scrollLine = parseInt((aceStartPos.row + aceEndPos.row)/2)+1;
	IDE.editor.editor.scrollToLine(scrollLine, true, true, function () {});

	var sel = IDE.editor.editor.getSelection();
	var range = sel.getRange();
	
	range.setStart( aceStartPos.row, aceStartPos.column );
	range.setEnd( aceEndPos.row, aceEndPos.column );

	sel.setSelectionRange( range );
};

IDE.getText = function() {
	var content2Search = IDE.editor.getContent();
	
	// the workaround of find in files API
	content2Search = content2Search.replace(/(\n)/gm,"");
	return content2Search;
};

IDE.getSelectedText = function() {
	return IDE.editor.editor.getSelectedText();
};

IDE.insertText = function(text2Insert) {
	IDE.editor.editor.session.replace(IDE.editor.editor.selection.getRange(), text2Insert) 
};