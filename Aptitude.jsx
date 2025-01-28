import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AptitudeTest() {
  const [quizData, setQuizData] = useState([]);    
  const [selectedOption, setSelectedOption] = useState('');  
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [score, setScore] = useState(0);    
  const [loading, setLoading] = useState(true);    
  const navigate = useNavigate();    

  const token = localStorage.getItem('token');    

  useEffect(() => {
    if (!token) {
      navigate('/login');    
      return;
    }

    axios.get('http://localhost:5000/api/quiz', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setQuizData(response.data.data);    
      setLoading(false);   
    })
    .catch(err => {
      console.error('Error fetching quiz data:', err);    
      alert('Something went wrong while fetching quiz data');
    });
  }, [navigate, token]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);    
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedOption === quizData[currentQuestion].correctAnswer;    

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);    
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);    
      setSelectedOption('');    
    } else {
      axios.post('http://localhost:5000/api/score', { score: score + (isCorrect ? 1 : 0) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert(`Quiz completed! Your score is ${score + (isCorrect ? 1 : 0)}`);
      })
      .catch(err => {
        console.error('Error saving score:', err);
        alert('Something went wrong while saving your score');
      });
    }
  };

  if (loading) {
    return <p>Loading quiz...</p>;    
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Aptitude Test</h1>
      <h2 style={styles.question}>
        {quizData[currentQuestion].question}    
      </h2>
      <div>
        {quizData[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            style={styles.optionButton(selectedOption === option)}    
            onClick={() => handleOptionSelect(option)}    
          >
            {option}    
          </button>
        ))}
      </div>
      <div>
        <button style={styles.submitButton} onClick={handleSubmitAnswer}>
          Submit Answer    
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  question: {
    marginBottom: '20px',
    fontSize: '18px',
    color: '#333',
  },
  optionButton: (isSelected) => ({
    width: '300px',
    height: '50px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: isSelected ? '#4CAF50' : '#f7f7f7',
    color: isSelected ? '#fff' : '#333',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  }),
  submitButton: {
    width: '150px',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default AptitudeTest;
