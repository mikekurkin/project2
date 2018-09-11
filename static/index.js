document.addEventListener('DOMContentLoaded', () => {

  if (localStorage.getItem('username')) {
    document.querySelector('#name-display').innerHTML = 'Flack: '+localStorage.getItem('username')
    document.getElementById('name-form').remove();
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
    document.querySelector('#name-form form').onsubmit = () => {
      const name = document.getElementById('name-input').value;
      $('.alert').alert('close');
      localStorage.setItem('username', name);
      document.getElementById('name-display').innerHTML = 'Flack: '+localStorage.getItem('username');
      document.getElementById('name-form').remove();
      return false;
    };
  };

  // Set button actions
  function setActions() {
    document.querySelectorAll('.channel').forEach(button => {
      button.onclick = function() {
        const action = button.dataset.action;
        if (action === 'create') {
          function release() {
            if (document.getElementById('new-channel-name')){
              document.getElementById('new-channel-name').parentNode.remove();
              document.getElementById('new-channel').innerHTML = '<strong>+</strong> New channel';
            }
          }

          function create(name) {
            socket.emit('create channel', {
              'creator': localStorage.getItem('username'),
              'name': name
            });
            release();
          }

          if (!document.getElementById('channel-name')){
            const newchannel = `
              <div class="p-3 border-bottom">
                <input id="new-channel-name" class="form-control form-control-sm" type="text" autofocus="true" placeholder="Channel name">
              </div>
            `

            document.getElementById('channel-list').innerHTML += newchannel;
            document.getElementById('new-channel').innerHTML = '<strong>✓</strong> Create';

            document.getElementById('new-channel-name').onkeyup = event => {
              if (event.keyCode === 27) {
                release();
              }
              else if (event.keyCode === 13) {
                create(document.getElementById('new-channel-name').value);
              }
            }
          }
          else if (document.getElementById('new-channel-name').value) {
            create(document.getElementById('new-channel-name').value)
          }
        }
        else if (action === 'channel' && button.dataset.id) {
          socket.emit('get messages', {
            'id': button.dataset.id
          });
        }
      };
    });
  }
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () => {

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
    setActions();
  });
});
