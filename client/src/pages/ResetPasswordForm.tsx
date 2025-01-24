import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { apiConfig } from '../config/apiConfig';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const history = useHistory();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setMessage('');
    setError('');

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      return;
    }

    try {
      setIsLoading(true); 
      const endpointUrl = `${apiConfig.BACKEND_URL}/users/reset-password/${token}`;
      const response = await axios.post(endpointUrl,
        { oldPassword, newPassword, confirmPassword }
      );
      // TODO: fix data-message from server
      setMessage(response.data.message || 'Senha redefinida com sucesso. Redirecionando...');
      setTimeout(() => history.push('/login'), 3000);
    } catch (error) {
      setError('Ocorreu um erro ao redefinir sua senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: '90%', maxWidth: '25rem' }}>
            <IonCardContent>
              <h2 className='text-center'>Resete sua senha</h2>
              <form className="row gap-3 p-2">
                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    value={oldPassword}
                    onIonChange={(e) => setOldPassword(e.detail.value!)}
                    placeholder="Senha antiga"
                    label="Senha antiga"
                    labelPlacement="floating"
                    type="password"
                  />
                </div>
                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    value={newPassword}
                    onIonChange={(e) => setNewPassword(e.detail.value!)}
                    placeholder="Nova senha"
                    label="Nova senha"
                    labelPlacement="floating"
                    type="password"
                  />
                </div>
                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    value={confirmPassword}
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    placeholder="Confirmar nova senha"
                    label="Confirmar nova senha"
                    labelPlacement="floating"
                    type="password"
                  />
                </div>
                <div className="col-12">
                  <IonButton
                    expand="block"
                    color="primary"
                    className="custom-button"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? <IonSpinner name="crescent" /> : 'Resetar senha'}
                  </IonButton>
                </div>
                {message && (
                  <div className="alert alert-success col-12 text-center">{message}</div>
                )}
                {error && (
                  <div className="alert alert-danger col-12 text-center">{error}</div>
                )}
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
