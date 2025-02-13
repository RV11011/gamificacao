import React from 'react';
import './Cartoes.css';

const CartoesMelhoria = () => {
  const topCartoes = [
    { rank: 1, name: 'João', quantidade: 15 },
    { rank: 2, name: 'Maria', quantidade: 12 },
    { rank: 3, name: 'Pedro', quantidade: 10 },
  ];

  return (
    <div className="cartoes-container">
      <h2>Top 3 - Cartões de Melhoria</h2>
      <div className="cartoes-ranking">
        {topCartoes.map((pessoa) => (
          <div key={pessoa.rank} className={`cartao-item rank-${pessoa.rank}`}>
            <div className="rank-number">#{pessoa.rank}</div>
            <div className="pessoa-info">
              <h3>{pessoa.name}</h3>
              <p>{pessoa.quantidade} cartões</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartoesMelhoria;