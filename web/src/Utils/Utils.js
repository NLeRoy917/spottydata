const { keyframes } = require('styled-components')

class Utils {
    constructor() {
    }

    getKeySignatureImg = (key) => {
        switch(key) {
          case 'A major':
            return require('../images/chords_imgs/amaj.png')
            break
          case 'A minor':
            return require('../images/chords_imgs/amin.png')
            break
          case 'A# major':
            return require('../images/chords_imgs/asmaj.png')
            break
          case 'A# minor':
            return require('../images/chords_imgs/asmin.png')
            break
          case 'B major':
            return require('../images/chords_imgs/bmaj.png')
            break
          case 'B minor':
            return require('../images/chords_imgs/bmin.png')
            break
          case 'C major':
            return require('../images/chords_imgs/amin.png')
            break
          case 'C minor':
            return require('../images/chords_imgs/cmin.png')
            break
          case 'C# major':
            return require('../images/chords_imgs/csmaj.png')
            break;
          case 'C# minor':
            return require('../images/chords_imgs/csmin.png')
            break
          case 'D major':
            return require('../images/chords_imgs/dmaj.png')
            break
          case 'D minor':
            return require('../images/chords_imgs/dmin.png')
            break
          case 'D# major':
            return require('../images/chords_imgs/dsmaj.png')
            break
          case 'D# minor':
            return require('../images/chords_imgs/dsmin.png')
            break
          case 'E major':
            return require('../images/chords_imgs/emaj.png')
            break
          case 'E minor':
            return require('../images/chords_imgs/emin.png')
            break
          case 'F major':
            return require('../images/chords_imgs/fmaj.png')
            break
          case 'F minor':
            return require('../images/chords_imgs/fmin.png')
            break
          case 'F# major':
            return require('../images/chords_imgs/fsmaj.png')
            break
          case 'F# minor':
            return require('../images/chords_imgs/fsmin.png')
            break
          case 'G major':
            return require('../images/chords_imgs/gmaj.png')
            break
          case 'G minor':
            return require('../images/chords_imgs/gmin.png')
            break
          case 'G# major':
            return require('../images/chords_imgs/gsmaj.png')
            break
          case 'G# minor':
            return require('../images/chords_imgs/gsmin.png')
            break
          
          
        }
      }

      msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
          seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return minutes + ":" + seconds + "." + milliseconds;
      }
  }
  export default Utils;