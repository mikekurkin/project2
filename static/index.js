document.addEventListener('DOMContentLoaded', () => {

  if (localStorage.getItem('username')) {
    document.querySelector('#name-display').innerHTML = 'Flack: '+localStorage.getItem('username')
  }
  else {
    document.getElementById('name-form').style.display = 'block';
    document.getElementById('name-input').onkeyup = function(){
      if(this.value.length > 0){
        document.getElementById('name-button').disabled = false;
      }
      else{
        document.getElementById('name-button').disabled = true;
      }
    }
    document.querySelector('#name-form > form').onsubmit = () => {
      const name = document.getElementById('name-input').value;
      $('.alert').alert('close');
      localStorage.setItem('username', name);
      document.getElementById('name-display').innerHTML = 'Flack: '+localStorage.getItem('username');
      return false;
    };
  };

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () => {
    document.querySelectorAll('.channel').forEach(button => {
      button.onclick = () => {
        const action = button.dataset.action;
        if (action === 'create') {
          if (!document.getElementById('channel-name')){
            const newchannel = `
              <div class="p-3 border-bottom">
                <input id="channel-name" class="form-control form-control-sm" type="text" autofocus="true" placeholder="Channel name">
              </div>
            `
            document.getElementById('channel-list').innerHTML += newchannel;
            document.getElementById('new-channel').innerHTML = '<strong>✓</strong> Create';
          }
          else if (document.getElementById('channel-name').value){
            socket.emit('create channel', {
              'creator': localStorage.getItem('username'),
              'name': document.getElementById('channel-name').value
            });
            document.getElementById('new-channel').innerHTML = '<strong>+</strong> New channel';
          }
        }
        else if (action === 'channel' && button.dataset.id) {
          socket.emit('get messages', {
            'id': button.dataset.id
          });
        }
      };
    });
    socket.emit('get channel list', {});
  });


  socket.on('channel list', data => {
    var list = '';
    for(var i=0; i < data.length; i++){
      list += `
      <div class="p-3 border-bottom channel" data-action="channel" data-id="${data[i]['id']}">
        ${data[i]["name"]}
      </div>
      `
    };
    document.getElementById('channel-list').innerHTML=list;
  });
});
