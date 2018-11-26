if (/^\/archive\/(?!index)/.test(window.location.pathname)) {
  var nav = document.getElementsByTagName('nav')[0]
  nav.className += ' archive';

  var div = document.createElement('div');
  div.className = 'archive-notice';
  div.innerHTML = '<i class="fa fa-exclamation-triangle"></i> This is an archived Tech Radar. <a href="/index.html">Visit the current edition.</a>'
  nav.parentNode.insertBefore(div, nav);
}
