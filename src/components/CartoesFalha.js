import React from 'react';
import './Cartoes.css';

const CartoesFalha = () => {
  const topCartoes = [
    { rank: 1, name: 'Ana', quantidade: 8 },
    { rank: 2, name: 'Carlos', quantidade: 6 },
    { rank: 3, name: 'Julia', quantidade: 5 },
  ];

  return (
    <div className="cartoes-container">
      <h2>Top 3 - Cartões de Falha</h2>
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

export default CartoesFalha;