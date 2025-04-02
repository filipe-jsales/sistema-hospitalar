import {
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonBackButton,
  } from "@ionic/react";
  import { useState, useEffect } from "react";
  import { useParams, useHistory } from "react-router-dom";
  import { useAppDispatch, useAppSelector } from "../../store/hooks";
  import {
    clearCategoryData,
    clearSuccessMessage,
    fetchCategoryById,
    updateCategory,
  } from "../../store/slices/category/fetchCategoryByIdSlice";
  import { clearCategoryError } from "../../store/slices/category/fetchCategoriesSlice";
  
  interface CategoryParams {
    id: string;
  }
  
  const EditCategory: React.FC = () => {
    const { id } = useParams<CategoryParams>();
    const categoryId = parseInt(id, 10);
    const history = useHistory();
    const dispatch = useAppDispatch();
  
    const { category, loading, error, successMessage } = useAppSelector(
      (state) => state.categoryDetails
    );
  
    const [categoryInfo, setCategoryInfo] = useState({
      name: "",
    });
  
    const [errors, setErrors] = useState({
      name: "",
    });
  
    useEffect(() => {
      dispatch(fetchCategoryById(categoryId))
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar categoria:", error);
        });
  
      return () => {
        dispatch(clearCategoryError());
        dispatch(clearSuccessMessage());
        dispatch(clearCategoryData());
      };
    }, [dispatch, categoryId]);
  
    useEffect(() => {
      if (category) {
        setCategoryInfo({
          name: category.name || "",
        });
      }
    }, [category]);
  
    const validateInputs = () => {
      const newErrors: any = {};
      if (!categoryInfo.name.trim()) newErrors.name = "Campo obrigatório.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(clearCategoryError());
      dispatch(clearSuccessMessage());
  
      if (validateInputs()) {
        dispatch(updateCategory({ categoryId, categoryData: categoryInfo }))
          .unwrap()
          .then(() => {
            setTimeout(() => {
              history.push("/categories");
            }, 2000);
          })
          .catch((error) => {
            console.error("Atualização falhou:", error);
          });
      }
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/categories" />
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sistema de Categorias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Editar Categoria
              </h1>
              <IonCardContent>
                {loading && !category ? (
                  <div className="text-center p-3">
                    <IonSpinner name="crescent" />
                    <p>Carregando dados da categoria...</p>
                  </div>
                ) : error && !category ? (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                    <div className="mt-3">
                      <IonButton
                        fill="solid"
                        color="primary"
                        onClick={() => history.push("/categories")}
                      >
                        Voltar para a listagem
                      </IonButton>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleUpdate}
                    className="row justify-content-center align-items-center gap-3 p-2"
                  >
                    <div className="col-12">
                      <IonInput
                        color={"dark"}
                        fill="outline"
                        placeholder="Nome da Categoria"
                        label="Nome"
                        labelPlacement="floating"
                        mode="md"
                        value={categoryInfo.name}
                        onIonInput={(e) => {
                          setCategoryInfo({
                            ...categoryInfo,
                            name: String(e.target.value),
                          });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                      />
                      {errors.name && (
                        <span className="text-danger">{errors.name}</span>
                      )}
                    </div>
  
                    <div className="col-12 d-flex justify-content-between">
                      <IonButton
                        color="medium"
                        onClick={() => history.push("/categories")}
                      >
                        Cancelar
                      </IonButton>
                      <IonButton
                        expand="block"
                        color="primary"
                        className="custom-button"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <IonSpinner name="crescent" />
                        ) : (
                          "Salvar Alterações"
                        )}
                      </IonButton>
                    </div>
  
                    {successMessage && (
                      <div className="alert alert-success col-12 text-center">
                        {successMessage}
                      </div>
                    )}
  
                    {error && (
                      <div className="alert alert-danger col-12 text-center">
                        {error}
                      </div>
                    )}
                  </form>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditCategory;