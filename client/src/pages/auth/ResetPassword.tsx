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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { requestPasswordReset, clearError, clearSuccessMessage } from '../../store/slices/passwordResetSlice';
import { useFormCleanup } from '../../hooks/useFormCleanup';

const ResetPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.passwordReset);

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => setEmail(''),
  });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    dispatch(requestPasswordReset(email))
      .unwrap()
      .then(() => {
        setEmail('');
      })
      .catch((error) => {
        console.error('Password reset request failed:', error);
      });
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
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : 'Enviar link para reset'}
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
              {error && (
                <div className="alert alert-danger col-12">{error}</div>
            )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordRequest;
