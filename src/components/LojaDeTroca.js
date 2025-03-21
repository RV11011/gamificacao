import React from 'react';
import './LojaDeTroca.css';
import trofeuImg from '../assets/Troféu Recompensa dos GM 2.png';
import brocheTeniccoImg from '../assets/Técnico.png';
import brocheEspecialistaImg from '../assets/Especialista.png';
import brocheAnalistaImg from '../assets/Analista.png';
import brocheConsultorImg from '../assets/Consultor.png';
import brocheEncantadorImg from '../assets/Encantador.png';
import brocheMentorImg from '../assets/Mentor.png';
import molduraTecnicoImg from '../assets/Moldura_Técnico.png';
import molduraEspecialistaImg from '../assets/Moldura_Especialista.png';
import molduraAnalistaImg from '../assets/Moldura_Analista.png';
import molduraConsultorImg from '../assets/Moldura_Consultor.png';
import molduraEncantadorImg from '../assets/Moldura_Encantador.png';
import molduraMentorImg from '../assets/Moldura_Mentor.png';
import tecnicoDeCarteirinhaImg from '../assets/Técnico de Carteirinha.png';
import destruidorDeAtendimentoImg from '../assets/Destruidor de Atendimento.png';
import theFlashImg from '../assets/Flash de BO.png';
import limpaFilaImg from '../assets/Limpa Fila.png';
import quaseUmAnalistaImg from '../assets/Quase um Analista.png';
import inovadorNatoImg from '../assets/Inovador Nato.png';
import orgulhoDaMariaImg from '../assets/Orgulho da Maria.png';
import domadorDeClienteImg from '../assets/Domador de Cliente.png';
import colecionadorDeEstrelasImg from '../assets/Colecionador de Estrelas.png';
import queridinhoDosClientesImg from '../assets/Queridinho dos Clientes.png';
import devoradorDeConhecimentoImg from '../assets/Devorador de Conhecimento.png';
import professorDoDepartamentoImg from '../assets/Professor do Departamento.png';

const LojaDeTroca = () => {
  return (
    <div className="loja-container">
      <h1>Loja de Troca</h1>
      <p>Saudações, companheiro! Você está em nossa loja de itens e recompensas, como responsável pela loja aqui vai algumas orientações:</p>
      <ul>
        <li>Dê uma boa olhada em todo nosso estoque de itens e brindes disponíveis, leia as descrições e faça sua escolha com calma.</li>
        <li>Sabendo o funcionamento da nossa loja - dúvidas chame um de nossos vendedores (Equipe de Qualidade).</li>
        <li>Após ter a certeza das mercadorias desejadas solicite sua compra em nosso Slack e aguarde a análise dos nossos vendedores para comprovar seu poder aquisitivo.</li>
      </ul>
      <h2>Recompensas</h2>
      <div className="recompensas">
        <div className="recompensa">
          <h3>Troféu Campeão dos GM</h3>
          <img src={trofeuImg} alt="Troféu Campeão dos GM" className="trofeu-img"/>
          <p>O troféu que é repassado apenas para aqueles que alcançam a maior quantidade de XP no mês. O troféu é entregue na reunião mensal pelo antigo campeão que ficará na mesa do novo campeão até a próxima reunião.</p>
          <p><strong>Descrição:</strong> Um troféu imponente feito de uma estrutura moderna e elegante, em forma de torre de cristal azul reluzente, representando o crescimento e a evolução no jogo. Pequenos ícones gravados ao redor da torre simbolizam os indicadores-chave da gamificação: atendimento, score, treinamentos e inovação. Na base, a frase destacando o motivo do mérito. No topo, uma estrela dourada coroa o campeão do ranking de XP do mês.</p>
        </div>
        <div className="recompensa">
          <h3>Broches de Classe</h3>
          <ul>
            <li><img src={brocheTeniccoImg} alt="Técnico" className="broche-img" /> Técnico - 10 qualicoins</li>
            <li><img src={brocheEspecialistaImg} alt="Especialista" className="broche-img" /> Especialista - 10 qualicoins</li>
            <li><img src={brocheAnalistaImg} alt="Analista" className="broche-img" /> Analista - 10 qualicoins</li>
            <li><img src={brocheConsultorImg} alt="Consultor" className="broche-img" /> Consultor - 10 qualicoins</li>
            <li><img src={brocheEncantadorImg} alt="Encantador" className="broche-img" /> Encantador - 10 qualicoins</li>
            <li><img src={brocheMentorImg} alt="Mentor" className="broche-img" /> Mentor - 10 qualicoins</li>
          </ul>
        </div>
        <div className="recompensa">
          <h3>Molduras de Classe</h3>
          <ul>
            <li><img src={molduraTecnicoImg} alt="Técnico" className="moldura-img" /> Técnico - 15 qualicoins</li>
            <li><img src={molduraEspecialistaImg} alt="Especialista" className="moldura-img" /> Especialista - 15 qualicoins</li>
            <li><img src={molduraAnalistaImg} alt="Analista" className="moldura-img" /> Analista - 15 qualicoins</li>
            <li><img src={molduraConsultorImg} alt="Consultor" className="moldura-img" /> Consultor - 15 qualicoins</li>
            <li><img src={molduraEncantadorImg} alt="Encantador" className="moldura-img" /> Encantador - 15 qualicoins</li>
            <li><img src={molduraMentorImg} alt="Mentor" className="moldura-img" /> Mentor - 15 qualicoins</li>
          </ul>
        </div>
        <div className="recompensa">
          <h3>Insígnias</h3>
          <ul>
            <li><img src={tecnicoDeCarteirinhaImg} alt="Técnico de Carteirinha" className="insignia-img" /> <strong>Técnico de Carteirinha</strong> - Requisito: Não receber nota baixa com etiqueta técnica no mês. Efeito: A cada 5 atendimentos finalizados, ganha +1 XP extra. QualiCoins: 5</li>
            <li><img src={destruidorDeAtendimentoImg} alt="Destruidor de Atendimento" className="insignia-img" /> <strong>Destruidor de Atendimento</strong> - Requisito: Finalizar o dobro de atendimentos da média por colaborador no mês. Efeito: Ganha +1 de XP extra para cada atendimento com motivo informado. QualiCoins: 12</li>
            <li><img src={theFlashImg} alt="The Flash" className="insignia-img" /> <strong>The Flash</strong> - Requisito: Atingir menos de 24 horas de TMA. Efeito: Recebe +20 de XP extra para cada atendimento finalizado em menos de 8 horas. QualiCoins: 10</li>
            <li><img src={limpaFilaImg} alt="Limpa Fila" className="insignia-img" /> <strong>Limpa Fila</strong> - Requisito: Atingir menos de 3 minutos de TMF. Efeito: Recebe um bônus de 100 de XP todo mês. QualiCoins: 12</li>
            <li><img src={quaseUmAnalistaImg} alt="Quase um Analista" className="insignia-img" /> <strong>Quase um Analista</strong> - Requisito: Abrir 12 cartões de falha no mês. Efeito: Dobra o XP ganho na temporada com a abertura de cartões de falha. QualiCoins: 10</li>
            <li><img src={inovadorNatoImg} alt="Inovador Nato" className="insignia-img" /> <strong>Inovador Nato</strong> - Requisito: Abrir 5 cartões de melhoria de sua própria autoria no mês. Efeito: Pode transformar 1% do XP total em QualiCoins. QualiCoins: 12</li>
            <li><img src={orgulhoDaMariaImg} alt="Orgulho da Maria" className="insignia-img" /> <strong>Orgulho da Maria</strong> - Requisito: Não ter nenhum erro de documentação. Efeito: Ganha +50 de XP por implantação finalizada. QualiCoins: 9</li>
            <li><img src={domadorDeClienteImg} alt="Domador de Cliente" className="insignia-img" /> <strong>Domador de Cliente</strong> - Requisito: Finalizar todas as implantações no prazo. Efeito: Dobra o XP ganho por implantação no prazo. QualiCoins: 12</li>
            <li><img src={colecionadorDeEstrelasImg} alt="Colecionador de Estrelas" className="insignia-img" /> <strong>Colecionador de Estrelas</strong> - Requisito: Ter 60% da taxa de avaliação no mês. Efeito: Recebe +20 de XP extra para cada 1% a mais que 50% da taxa de avaliação todo mês. QualiCoins: 11</li>
            <li><img src={queridinhoDosClientesImg} alt="Queridinho dos Clientes" className="insignia-img" /> <strong>Queridinho dos Clientes</strong> - Requisito: Alcançar 4,95 de média score no mês. Efeito: Não perde mais XP por nota justa. QualiCoins: 12</li>
            <li><img src={devoradorDeConhecimentoImg} alt="Devorador de Conhecimento" className="insignia-img" /> <strong>Devorador de Conhecimento</strong> - Requisito: Concluir 10 PDIs na temporada. Efeito: Dobra o XP ganho na temporada em projetos. QualiCoins: 14</li>
            <li><img src={professorDoDepartamentoImg} alt="Professor do Departamento" className="insignia-img" /> <strong>"Me chame de Professor!"</strong> - Requisito: Realizar 5 treinamentos na temporada. Efeito: Dobra o XP ganho na temporada com a participação de treinamentos. QualiCoins: 16</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LojaDeTroca;