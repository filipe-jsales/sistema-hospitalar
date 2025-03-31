import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  activateAccount,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/activationSlice";

interface ActivationParams {
  token: string;
}

const ActivateAccount: React.FC = () => {
  const { token } = useParams<ActivationParams>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.activation
  );

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    dispatch(activateAccount(token))
      .unwrap()
      .then(() => {
        setTimeout(() => history.push("/login"), 3000);
      })
      .catch((error) => {
        console.error("Activation failed:", error);
      });
  }, [token, history, dispatch]);

  return (
    <IonPage>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center">
          <IonCard
            style={{ width: "90%", maxWidth: "30rem", textAlign: "center" }}
          >
            <IonCardContent>
              {loading && (
                <>
                  <IonSpinner color="primary" />
                  <p>Ativando sua conta...</p>
                </>
              )}
              {successMessage && (
                <>
                  <p className="text-success">{successMessage}</p>
                  <p>Redirecionando para a página de login...</p>
                </>
              )}
              {error && <p className="text-danger">{error}</p>}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ActivateAccount;
