import { IonPage, IonContent, IonCard, IonCardContent, IonSpinner } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig';

interface ActivationParams {
  token: string;
}

const ActivateAccount: React.FC = () => {
  const { token } = useParams<ActivationParams>();
  const history = useHistory();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const endpointUrl = `${apiConfig.BACKEND_URL}:${apiConfig.BACKEND_PORT}/users/activate/${token}`;
        const response = await axios.get(endpointUrl);
        if (response.status === 200) {
          setStatus('success');
          setMessage('Sua conta foi ativada com sucesso!');
          setTimeout(() => history.push('/login'), 3000);
        } else {
          setStatus('error');
          setMessage('Ativação falhou. O link porde ser inválido ou expirou.');
        }
      } catch (error) {
        console.log(error)
        setStatus('error');
        setMessage('Um erro ocorreu durante o registro. Por favor tente de novo..');
      }
    };

    activateAccount();
  }, [token, history]);

  return (
    <IonPage>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center">
          <IonCard style={{ width: '90%', maxWidth: '30rem', textAlign: 'center' }}>
            <IonCardContent>
              {status === 'loading' && (
                <>
                  <IonSpinner color="primary" />
                  <p>Ativando sua conta...</p>
                </>
              )}
              {status === 'success' && (
                <>
                  <p className="text-success">{message}</p>
                  <p>Redirecionando para a página de login...</p>
                </>
              )}
              {status === 'error' && <p className="text-danger">{message}</p>}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ActivateAccount;
