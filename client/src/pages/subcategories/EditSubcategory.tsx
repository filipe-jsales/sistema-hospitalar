import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonSelect,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearSubcategoryData,
  clearSuccessMessage,
  fetchSubcategoryById,
  updateSubcategory,
} from "../../store/slices/subcategory/fetchSubcategoryByIdSlice";
import { clearSubcategoryError } from "../../store/slices/subcategory/fetchSubcategoriesSlice";
import Header from "../../components/Header/Header";

interface SubcategoryParams {
  id: string;
}

const EditSubcategory: React.FC = () => {
  const { id } = useParams<SubcategoryParams>();
  const subcategoryId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { subcategory, loading, error, successMessage } = useAppSelector(
    (state) => state.subcategoryDetails
  );

  const [subcategoryInfo, setSubcategoryInfo] = useState({
    name: "",
    categoryId: null as number | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    categoryId: "",
  });

  const { categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchSubcategoryById(subcategoryId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar subcategoria:", error);
      });

    return () => {
      dispatch(clearSubcategoryError());
      dispatch(clearSuccessMessage());
      dispatch(clearSubcategoryData());
    };
  }, [dispatch, subcategoryId]);

  useEffect(() => {
    if (subcategory) {
      setSubcategoryInfo({
        name: subcategory.name || "",
        categoryId: subcategory.categoryId || null,
      });
    }
  }, [subcategory]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!subcategoryInfo.name.trim()) newErrors.name = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearSubcategoryError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(
        updateSubcategory({
          subcategoryId,
          subcategoryData: subcategoryInfo,
        })
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/subcategories");
          }, 2000);
        })
        .catch((error) => {
          console.error("Atualização falhou:", error);
        });
    }
  };

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Editar Subcategoria
            </h1>
            <IonCardContent>
              {loading && !subcategory ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados da subcategoria...</p>
                </div>
              ) : error && !subcategory ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/subcategories")}
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
                      placeholder="Nome da Subcategoria"
                      label="Nome"
                      labelPlacement="floating"
                      mode="md"
                      value={subcategoryInfo.name}
                      onIonInput={(e) => {
                        setSubcategoryInfo({
                          ...subcategoryInfo,
                          name: String(e.target.value),
                        });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                    />
                    {errors.name && (
                      <span className="text-danger">{errors.name}</span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonItem>
                      <IonLabel position="stacked">Categoria</IonLabel>
                      <IonSelect
                        value={subcategoryInfo.categoryId}
                        placeholder="Selecione uma categoria"
                        onIonChange={(e) => {
                          setSubcategoryInfo({
                            ...subcategoryInfo,
                            categoryId: e.detail.value,
                          });
                          if (errors.categoryId)
                            setErrors({ ...errors, categoryId: "" });
                        }}
                      >
                        {categoriesLoading ? (
                          <IonSelectOption disabled>
                            Carregando categorias...
                          </IonSelectOption>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <IonSelectOption
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </IonSelectOption>
                          ))
                        ) : (
                          <IonSelectOption disabled>
                            Nenhuma categoria encontrada
                          </IonSelectOption>
                        )}
                      </IonSelect>
                    </IonItem>
                    {errors.categoryId && (
                      <span className="text-danger">{errors.categoryId}</span>
                    )}
                  </div>

                  <div className="col-12 d-flex justify-content-between">
                    <IonButton
                      color="medium"
                      onClick={() => history.push("/subcategories")}
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

export default EditSubcategory;
