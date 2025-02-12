import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="greeting">
        <h1>Good morning, Alex</h1>
        <p>Bem vindo a Gamificação</p>
      </div>
      <div className="overview-cards">
        <div className="overview-card">
          <div className="icon">
            <i className="fas fa-headset"></i>
          </div>
          <div className="overview-details">
            <h2>Atendimentos abertos</h2>
            <p>XX</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="overview-details">
            <h2>Atendimentos com mais de 10 minutos na fila</h2>
            <p>XX</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="overview-details">
            <h2>Score Médio</h2>
            <p>XX</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="icon">
            <i className="fas fa-triangle-exclamation"></i>
          </div>
          <div className="overview-details">
            <h2>Finalizados sem motivo informado</h2>
            <p>XX</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;