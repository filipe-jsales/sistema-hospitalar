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
import { useParams, useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError, clearSuccessMessage, resetPassword } from '../../store/slices/passwordResetSlice';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.passwordReset);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatch(clearError());
      dispatch(clearSuccessMessage());
      return;
    }

    dispatch(resetPassword({ token, oldPassword, newPassword, confirmPassword }))
      .unwrap()
      .then(() => {
        setTimeout(() => history.push('/login'), 3000);
      })
      .catch((error) => {
        console.error('Password reset failed:', error);
      });
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
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : 'Resetar senha'}
                  </IonButton>
                </div>
                {successMessage && (
                  <div className="alert alert-success col-12 text-center">{successMessage}</div>
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
