import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);

  function getXY() {
    const x = (currentIndex % 3) + 1; // Calculate x coordinate
    const y = Math.floor(currentIndex / 3) + 1; // Calculate y coordinate
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setEmail(initialEmail);
    setSteps(initialSteps);
    setCurrentIndex(initialIndex);
    setMessage(initialMessage);
  }

  function getNextIndex(direction) {
    const gridSize = 3; // 3x3 grid
    let newIndex = currentIndex;

    switch (direction) {
      case 'left':
        if (currentIndex % gridSize > 0) newIndex -= 1;
        break;
      case 'up':
        if (currentIndex >= gridSize) newIndex -= gridSize;
        break;
      case 'right':
        if (currentIndex % gridSize < gridSize - 1) newIndex += 1;
        break;
      case 'down':
        if (currentIndex < gridSize * (gridSize - 1)) newIndex += gridSize;
        break;
      default:
        break;
    }

    return newIndex;
  }

  function move(evt) {
    const direction = evt.target.id; // Get direction from button id
    const newIndex = getNextIndex(direction);
    setCurrentIndex(newIndex);
    setSteps(steps + 1);
    setMessage(getXYMessage());
  }

  function onChange(evt) {
    setEmail(evt.target.value); // Update email state
  }

  async function onSubmit(evt) {
    evt.preventDefault(); // Prevent default form submission
    const { x, y } = getXY();
    const payload = { x, y, steps, email };

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message); // Display success message
      } else {
        setMessage(result.error); // Display error message
      }
    } catch (error) {
      setMessage('An error occurred.'); // Handle fetch error
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
