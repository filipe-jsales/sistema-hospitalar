import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonIcon,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonToast,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import { RefresherEventDetail } from "@ionic/core";
import {
  createOutline,
  trashOutline,
  checkmarkCircle,
  closeCircle,
} from "ionicons/icons";
import {
  clearUserError,
  clearUsers,
  fetchUsers,
  UserData,
} from "../../store/slices/user/fetchUsersSlice";
import { useHistory } from "react-router";
import {
  deleteUser,
  resetDeleteStatus,
} from "../../store/slices/user/deleteUserSlice";
import Header from "../../components/Header/Header";

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { users, loading, error, pagination } = useAppSelector(
    (state) => state.users
  );
  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useAppSelector((state) => state.deleteUser);
  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUsers(1);

    return () => {
      dispatch(clearUsers());
      dispatch(clearUserError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Usuário excluído com sucesso!");
      setShowToast(true);
      loadUsers(currentPage);
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch, currentPage]);

  const loadUsers = (page: number) => {
    dispatch(fetchUsers(page))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar usuários:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchUsers(currentPage))
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (user: UserData) => {
    history.push(`/users/edit/${user.id}`);
  };

  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id));
      setShowAlert(false);
      setSelectedUser(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      loadUsers(newPage);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <IonPage>
      <Header />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Listagem de Usuários
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar usuários"
                />

                <IonButton
                  color="primary"
                  routerLink="/users/create"
                  className="ms-2"
                >
                  Novo Usuário
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando usuários...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhum usuário encontrado com esta busca."
                    : "Nenhum usuário cadastrado."}
                </div>
              ) : (
                <IonList>
                  {filteredUsers.map((user: UserData) => (
                    <IonItem key={user.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{`${user.firstName} ${user.lastName}`}</h2>
                            <p>{user.email}</p>
                            <p>{user.phoneNumber || "Sem telefone"}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color={user.isActive ? "success" : "danger"}>
                            <IonIcon
                              icon={
                                user.isActive ? checkmarkCircle : closeCircle
                              }
                            />
                            <IonLabel>
                              {user.isActive ? "Ativo" : "Inativo"}
                            </IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(user)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(user)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && pagination && (
                <div className="text-center mt-3">
                  <p>
                    Exibindo {users.length} de {pagination.totalItems} usuários
                    {searchText && " (filtrados)"}
                  </p>

                  {pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <IonButton
                        fill="clear"
                        disabled={currentPage === 1}
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                      >
                        Anterior
                      </IonButton>

                      <div className="d-flex align-items-center mx-2">
                        <span>
                          Página {currentPage} de {pagination.totalPages}
                        </span>
                      </div>

                      <IonButton
                        fill="clear"
                        disabled={currentPage === pagination.totalPages}
                        onClick={() =>
                          handlePageChange(
                            Math.min(pagination.totalPages, currentPage + 1)
                          )
                        }
                      >
                        Próxima
                      </IonButton>
                    </div>
                  )}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir o usuário ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedUser(null);
              },
            },
            {
              text: "Excluir",
              handler: confirmDelete,
            },
          ]}
        />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={deleteSuccess ? "success" : "danger"}
        />
      </IonContent>
    </IonPage>
  );
};

export default UsersList;
