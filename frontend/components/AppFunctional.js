import React from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = React.useState(initialMessage);
  const [email, setEmail] = React.useState(initialEmail);
  const [steps, setSteps] = React.useState(initialSteps);
  const [index, setIndex] = React.useState(initialIndex);

  function getXY() {
    return {
      x: (index % 3) + 1,
      y: Math.floor(index / 3) + 1,
    };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage('');
    setEmail('');
    setSteps(0);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const nextIndex = {
      left: (index % 3 === 0) ? -1 : index - 1, // Can't go left if in the first column
      up: index > 2 ? index - 3 : -1,
      right: (index % 3 === 2) ? -1 : index + 1, // Can't go right if in the last column
      down: index < 6 ? index + 3 : -1,
    };
    return nextIndex[direction];
  }

  function move(evt) {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);
    if (newIndex === -1) {
      setMessage(`You can't go ${direction}`);
    } else {
      if (newIndex !== index) {
        setIndex(newIndex);
        setSteps(prevSteps => prevSteps + 1);
        setMessage('');
      }
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();
    const payload = {
      x: x,
      y: y,
      steps: steps,
      email: email,
    };

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setMessage(data.message || 'Success!');
      setEmail(''); // Clear email input after submission
    } catch (error) {
      setMessage('Error submitting the form.');
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : ''}
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
