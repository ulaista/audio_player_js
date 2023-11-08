document.addEventListener('DOMContentLoaded', function() {
   const audio = new Audio();
   const playButton = document.getElementById('play');
   const prevButton = document.getElementById('prev');
   const nextButton = document.getElementById('next');
   const volumeControl = document.getElementById('volume-control');
   const seekSlider = document.getElementById('seek-slider');
   const albumArt = document.getElementById('album-art');
   const artistName = document.getElementById('artist-name');
   const trackName = document.getElementById('track-name');
   let visualizationContainer = document.getElementById('visualization');
   canvas = document.createElement('canvas');
   ctx = canvas.getContext('2d');
   visualizationContainer.appendChild(canvas);
   canvas.width = visualizationContainer.clientWidth;
   canvas.height = visualizationContainer.clientHeight;
 
 
   let currentTrack = 0;
   const playlist = [
     {
       artist: 'eldzhey',
       title: 'allo_allo',
       file: '/music/eldzhey_-_allo-allo.mp3',
       cover: '/img/1.jpeg'
     },
     {
       artist: 'OneRepublic',
       title: 'I ain\'t worried',
       file: '/music/OneRepublic - I Aint.mp3',
       cover: '/img/2.jpeg'
     },
     {
       artist: 'Ula',
       title: 'Soul Hip-Hop',
       file: '/music/Soul Hip-Hop - Ula.mp3',
       cover: '/img/3.jpeg'
     }
     // Добавьте больше треков здесь
   ];
 
   // Функция для загрузки трека
   function loadTrack(trackIndex) {
     const track = playlist[trackIndex];
     audio.src = track.file;
     artistName.textContent = track.artist;
     trackName.textContent = track.title;
     albumArt.style.backgroundImage = `url(${track.cover})`;
     audio.load();
   }

   // Обновление ползунка перемотки
   function updateSeekSlider() {
     const progress = (audio.currentTime / audio.duration) * 100 || 0;
     seekSlider.value = progress;
   }

  // Управление воспроизведением
  playButton.addEventListener('click', function() {
      
    if (audio.paused) {
      audio.play();
      playButton.textContent = 'Pause';
    } else {
      audio.pause();
      playButton.textContent = 'Play';
    }
   });
   
   audioContext = new (window.AudioContext || window.webkitAudioContext)();
   analyser = audioContext.createAnalyser();
   source = audioContext.createMediaElementSource(audio);
   source.connect(analyser);
   analyser.connect(audioContext.destination);
   drawVisualization();
   
  function drawVisualization() {
   requestAnimationFrame(drawVisualization);
   let freqData = new Uint8Array(analyser.frequencyBinCount);
   analyser.getByteFrequencyData(freqData);
   ctx.clearRect(0, 0, canvas.width, canvas.height);
 
   for (let i = 0; i < freqData.length; i++) {
     let barHeight = freqData[i] / 2;
     ctx.fillStyle = 'white';
     ctx.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
   }
 }
  // Переключение на следующий трек
   nextButton.addEventListener('click', function() {
      currentTrack = (currentTrack + 1) % playlist.length;
      loadTrack(currentTrack);
      audio.play();
   });
 

  // Переключение на предыдущий трек
   prevButton.addEventListener('click', function() {
      if (audio.currentTime < 3) {
      currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
      } else {
      currentTrack = currentTrack;
      }
      loadTrack(currentTrack);
      audio.play();
   });
 

  // Управление громкостью
  volumeControl.addEventListener('input', function() {
    audio.volume = this.value;
  });

  // Обработка перемотки трека
  seekSlider.addEventListener('input', function() {
    const time = (audio.duration * (this.value / 100)) || 0;
    audio.currentTime = time;
  });

  // Событие для обновления ползунка перемотки во время воспроизведения
  audio.addEventListener('timeupdate', updateSeekSlider);

  // Загрузка первого трека в плейлисте
  loadTrack(currentTrack);


  // Воспроизведение трека после загрузки
  audio.addEventListener('canplay', function() {
   if (!audio.paused) {
     audio.play();
     playButton.textContent = 'Pause';
   }
 });

 // Событие окончания трека
 audio.addEventListener('ended', function() {
   playButton.textContent = 'Play';
   nextButton.click();
 });

//  // Перемотка в начало трека при клике на 'prev' если трек проигрывается меньше 3 секунд
//  prevButton.addEventListener('click', function() {
//    if (audio.currentTime < 3) {
//      currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
//      loadTrack(currentTrack);
//    } else {
//      audio.currentTime = 0;
//    }
//  });

 // Возобновление AudioContext после взаимодействия пользователя (если необходимо)
 document.getElementById('player').addEventListener('click', function() {
   if (audioContext && audioContext.state === 'suspended') {
     audioContext.resume();
   }
 });
});
