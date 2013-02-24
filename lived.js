var lived = (function() {
  var cm, sliderBubble, colorBubble, cursor;

  function init () {
    // DOM binding
    cm = CodeMirror.fromTextArea(document.querySelector("#code"));
    sliderBubble = document.querySelector(".text-options");
    colorBubble = document.querySelector(".color-picker");

    cm.on("cursorActivity", function (c) {
      cursor = c.getCursor();
      var token = c.getTokenAt(cursor);
      // DEBUG: console.log(token.string, token.type);
      if (token.type === "number") {
        $("#slider").slider("option", "value",  Number(token.string));
        showSliderBubble();
      } else if (token.string[0] === "#") {
        showColorBubble();
      } else {
        hideSliderBubble();
        hideColorBubble();
      }
    });

    // Slider init
    $("#slider").slider({
      min: 0,
      max: 100,
      value: 50,
      step: 1,
      slide: function (ev, ui) {
        onSlider(cursor, ui.value);
      }
    });

    // Colorpicker init
    $("#color-picke").spectrum({
      color: "#f00",
      showButtons: false,
      //flat: true,
      move: function(color) {
        onColorPicker(cursor, color.toHexString());
      }
    });

  }

  function onSlider (cursor, newNumber) {
    var token = cm.getTokenAt(cursor);
    //var oldNumber;
    //oldNumber = Number(token.string);

    // Select the token
    cm.setSelection({line: cursor.line, ch: token.start},
                    {line: cursor.line, ch: token.end});
    // Change the selection
    cm.replaceSelection(String(newNumber));
  }

  function onColorPicker (cursor, newColor) {
    var token = cm.getTokenAt(cursor);

    // Select the token
    cm.setSelection({line: cursor.line, ch: token.start},
                    {line: cursor.line, ch: token.end});
    // Change the selection
    cm.replaceSelection(String(newColor));
  }

  function showSliderBubble () {
    var cursorCoords = cm.cursorCoords(true);

    sliderBubble.className = "text-options active";
    sliderBubble.style.top = cursorCoords.top - 5 + document.body.scrollTop + "px";
    sliderBubble.style.left = cursorCoords.left + "px";
  }

  function hideSliderBubble() {
    sliderBubble.className = "text-options fade";
    setTimeout(function() {
      if (sliderBubble.className == "text-options fade") {
	sliderBubble.className = "text-options";
	sliderBubble.style.top = '-999px';
	sliderBubble.style.left = '-999px';
      }
    }, 260 )
  }

  function showColorBubble () {
    var cursorCoords = cm.cursorCoords(true);

    colorBubble.className = "color-picker active";
    colorBubble.style.top = cursorCoords.top - 5 + document.body.scrollTop + "px";
    colorBubble.style.left = cursorCoords.left + "px";
  }

  function hideColorBubble() {
    colorBubble.className = "color-picker fade";
    setTimeout(function() {
      if (colorBubble.className == "color-picker fade") {
	colorBubble.className = "color-picker";
	colorBubble.style.top = '-999px';
	colorBubble.style.left = '-999px';
      }
    }, 260 )
  }



  return {
    init: init,
    showSliderBubble: showSliderBubble,
    hideSliderBubble: hideSliderBubble,
    showColorBubble: showColorBubble,
    hideColorBubble: hideColorBubble
  }
})();