import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import sound from './censor-beep-7.mp3';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLable, setTimerLable] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [warnColor, setWarnColor] = useState({color:'rgb(240, 223, 192)'});

  const minutes = Math.floor(timeLeft / 60);
  const mins = minutes < 10 ? "0"+minutes : minutes;
  const seconds = timeLeft % 60;
  const secs = seconds < 10 ? "0"+seconds : seconds;
  const displayTimeLeft = mins + ":" + secs;
  const beeper = document.querySelector('#beep');



  function breakLengthHandle(e) {
    if(e.target.value === '↑' && breakLength < 60){
      setBreakLength(breakLength + 1);
    } else if(e.target.value === '↓' && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  }
  function sessionLengthHandle(e) {
    if(e.target.value === '↑' && sessionLength < 60){
      setSessionLength(sessionLength + 1);
      setTimeLeft(timeLeft + 60);
    } else if(e.target.value === '↓' && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft(timeLeft - 60);
    }
  }

  useEffect(() => {
    if(isRunning) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

  }, [isRunning, timeLeft]);

  useEffect(()=>{
    if(timeLeft === -1) {
      if(isSession) {
        setIsSession(false);
        setTimeLeft(breakLength * 60);
        setTimerLable('Break');
      } else {
        setIsSession(true);
        setTimeLeft(sessionLength * 60);
        setTimerLable('Session')
      }
    }
  }, [timeLeft, isSession, breakLength, sessionLength]);

  useEffect(()=>{
    if(timeLeft < 60) {
      setWarnColor({color:'red'});
    } else {
      setWarnColor({color:'rgb(240, 223, 192)'});
    } 
  }, [timeLeft]);

  useEffect(()=>{
    if(timeLeft === 0) {
      beeper.play();
    }
  })

  function playAndPauseHandle(){
    setIsRunning(!isRunning);
  }


  function resetHandle(){ 
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLable('Session');
    setIsSession(true);
    setIsRunning(false)
    setBreakLength(5);
    beeper.pause();
    beeper.currentTime = 0;
  }

  return (
    <div className="App">
      <h1 className="title">Pomodoro Clock</h1>
      <div className="length">
        <div className="break">
          <div id="break-label">Break Length</div>
          <div className="break-ctrl">
            <button id="break-increment" value="↑" onClick={breakLengthHandle}>↑</button>
            <div className="set-break" id="break-length">{breakLength}</div>
            <button id="break-decrement" value="↓" onClick={breakLengthHandle}>↓</button>
          </div>
        </div>
        <div className="session">
          <div id="session-label">Session Length</div>
          <div className="session-ctrl">
            <button id="session-increment" value="↑" onClick={sessionLengthHandle}>↑</button>
            <div className="set-session" id="session-length">{sessionLength}</div>
            <button id="session-decrement" value="↓" onClick={sessionLengthHandle}>↓</button>
          </div> 
        </div>
      </div>
      <div className="display">
        <div id="timer-label" style={warnColor}>{timerLable}</div>
        <div id="time-left" style={warnColor}>{displayTimeLeft}</div>
      </div>
      <div className="controller">
        <button id="start_stop" onClick={playAndPauseHandle}>▶︎◼︎</button>
        <button id="reset" onClick={resetHandle}>↩︎</button>
      </div>
      <audio id="beep" preload='auto' src={sound} type='audio/mpeg'/>
    </div>
  );
}

export default App;
