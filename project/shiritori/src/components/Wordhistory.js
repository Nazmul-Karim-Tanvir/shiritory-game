import React from 'react';

function WordHistory({ wordHistory }) {
  return (
    <div>
      <h3>Word History</h3>
      <ul>
        {wordHistory?.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default WordHistory;
