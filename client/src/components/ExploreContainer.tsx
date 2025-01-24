import { Link } from 'react-router-dom';
import './ExploreContainer.css';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <div id="container">
      <strong>Bem vindo ao sistema hospitalar</strong>
      <p>
        CADASTRO DE USUÁRIOS:{' '}
        <Link to="/register">Ir para cadastro de usuários</Link>
      </p>
    </div>
  );
};

export default ExploreContainer;
