import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonRouterLink,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import axios from 'axios';
import { apiConfig } from '../config/apiConfig';
import ImageLogo from '../components/ImageLogo';

const ResetPasswordRequest: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido.');
      setSuccessMessage('');
      return;
    }
    try {
      const endpointUrl = `${apiConfig.BACKEND_URL}/users/reset-password-request`;
      const response = await axios.post(endpointUrl, {
        email,
      });
      // TODO: fix data-message from server
      setSuccessMessage(response.data.message || 'Email enviado com sucesso! Redirecionando...');
      setErrorMessage('');
      setEmail('');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Um erro ocorreu ao enviar o email. Por favor, tente novamente.'
      );
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: '90%', maxWidth: '30rem' }}>
            <IonCardContent>
              <h2 className='text-center'>Entre com o email da sua conta</h2>
              <form
                onSubmit={handleRequestReset}
                className="row justify-content-center align-items-center gap-3 p-2"
              >
                <div className="col-12">
                  <IonInput
                    color={'dark'}
                    fill="outline"
                    placeholder="Email"
                    type="email"
                    label="Email"
                    labelPlacement="floating"
                    mode="md"
                    value={email}
                    onIonInput={(e) => setEmail(e.target.value as string)}
                  />
                </div>

                 <div className="col-12">
                  <IonButton
                    expand="block"
                    color="primary"
                    className="custom-button"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <IonSpinner name="crescent" /> : 'Enviar link para reset'}
                  </IonButton>
                </div>
                <div className="col-12 p-1 text-center">
                  <IonRouterLink routerLink="/login">
                    <span style={{ textDecoration: 'underline' }} className="text-primary">
                      Já possui uma conta? Login
                    </span>
                  </IonRouterLink>
                </div>
              </form>
            {successMessage && (
              <div className="alert alert-success col-12">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="alert alert-danger col-12">{errorMessage}</div>
            )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordRequest;
