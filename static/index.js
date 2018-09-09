document.addEventListener('DOMContentLoaded', () => {

  if(!localStorage.getItem('username')){
    document.getElementById('name-form').style.display = 'block';
    document.getElementById('name-input').onkeyup = function(){
      if(this.value.length > 0){
        document.getElementById('name-button').disabled = false;
      }
      else{
        document.getElementById('name-button').disabled = true;
      }
    };
    document.querySelector('#name-form > form').onsubmit = () => {
      const name = document.getElementById('name-input').value;
      $('.alert').alert('close');
      localStorage.setItem('username', name);
      document.getElementById('name-display').innerHTML = localStorage.getItem('username');
      return false;
    };
  };

  document.querySelector('#name-display').innerHTML = localStorage.getItem('username');

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
});
