import { Link } from 'react-router-dom';
import './ExploreContainer.css';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContainerProps { } // FIX?

const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <div id="container">
      <strong>Bem vindo ao sistema hospitalar</strong>
      <p>
        CADASTRO DE USUÁRIOS:{' '}
        <Link to="/users/create-user">Ir para cadastro de usuários</Link>
      </p>
    </div>
  );
};

export default ExploreContainer;
