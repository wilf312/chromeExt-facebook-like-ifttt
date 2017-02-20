chrome.webRequest.onBeforeRequest.addListener(
  function (d) {
    var url = d.url;
    var methods = d.method;
    if (methods !== 'POST' ||
      url.indexOf('https://www.facebook.com/ufi/reaction') === -1||
      false ) {
      return;
    }
    var body = d.requestBody;

    if (body == null ||
        body.raw == null ||
        body.raw[0] == null ||
        body.raw[0].bytes == null ||
        false) {
      return;
    }

    console.log(url)
    console.log(body.raw[0].bytes)

    var bytes = body.raw[0].bytes

    var size = bytes.byteLength;
    var dv = new DataView(bytes);
    var request = "";
    for (var i = 0; i < size; i++) {
      var code = dv.getInt8(i);
      if (code < 0) code += 0x100;
      request += String.fromCharCode(code);
    }
    // debug
    console.log(request.length+":"+request);

    // ------ contentIdの取得
    urlObj = new URL('http://www.facebook.com/?'+request);

    var contentId = '';
    for(var value of urlObj.searchParams.entries()) {
      console.log(value);
      if (value[0] === 'ft_ent_identifier') {
        contentId = value[1];
      }
    }

    if (contentId === '') {
      console.log('no match')
      return;
    }

    // URLのポスト
    var saveURL = 'https://www.facebook.com/'+ contentId;
    var postURL = 'https://maker.ifttt.com/trigger/'+ CONFIG.CHANNEL.EVENT_NAME +'/with/key/'+ CONFIG.CHANNEL.API_KEY;

    console.log('コンテンツIDをサーバにプッシュする', saveURL)

    $.ajax({
      type: 'POST',
      url: postURL,
      data: {
        value1: saveURL
      },
      success: function(a) {
        console.log('success')
        console.log(a)
      }
    });



  },
  {
    urls: ['<all_urls>']
  },
  [
    "requestBody"
  ]
);