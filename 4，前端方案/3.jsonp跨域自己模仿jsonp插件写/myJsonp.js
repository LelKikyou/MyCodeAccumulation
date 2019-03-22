var count = 0;
function noop(){}
function jsonp(url, opts, fn){
  if ('function' === typeof opts) {
    fn = opts;
    opts = {};
  }
  if (!opts) opts = {};
  var prefix = '__jp';
  var id = opts.name || (prefix + (count++));
  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script;
  var timer;
  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      if (fn) fn(new Error('Timeout'));
    }, timeout);
  }
  function cleanup(){
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer);
  }
  function cancel(){
    if (window[id]) {
      cleanup();
    }
  }
  window[id] = function(data){
    cleanup();
    if (fn) fn(data);
  };
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
  url = url.replace('?&', '?');
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);
  return cancel;
}
