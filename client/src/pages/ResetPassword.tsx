import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonRouterLink,
  IonText,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:3000/users/reset-password-request', {
        email,
      });
      setSuccessMessage(response.data.message || 'Email enviado com sucesso!');
      setErrorMessage('');
      setEmail('');
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
          <IonCard style={{ width: '90%', maxWidth: '40rem' }}>
            <IonCardContent>
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
