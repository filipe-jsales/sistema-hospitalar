import { configureStore } from "@reduxjs/toolkit";
import activationReducer from "./slices/activationSlice";
import authReducer from "./slices/authSlice";
import passwordResetReducer from "./slices/passwordResetSlice";
import createUserReducer from "./slices/user/createUserSlice";
import fetchUsersReducer from "./slices/user/fetchUsersSlice";
import fetchUserByIdReducer from "./slices/user/fetchUserByIdSlice";
import deleteUserReducer from "./slices/user/deleteUserSlice";
import createHospitalReducer from "./slices/hospital/createHospitalSlice";
import fetchHospitalsReducer from "./slices/hospital/fetchHospitalsSlice";
import fetchHospitalByIdReducer from "./slices/hospital/fetchHospitalByIdSlice";
import deleteHospitalReducer from "./slices/hospital/deleteHospitalSlice";
import createIncidentReducer from "./slices/incident/createIncidentSlice";
import fetchIncidentsReducer from "./slices/incident/fetchIncidentsSlice";
import fetchIncidentByIdReducer from "./slices/incident/fetchIncidentByIdSlice";
import deleteIncidentReducer from "./slices/incident/deleteIncidentSlice";
import createThemeReducer from "./slices/theme/createThemeSlice";
import fetchThemesReducer from "./slices/theme/fetchThemesSlice";
import fetchThemeByIdReducer from "./slices/theme/fetchThemeByIdSlice";
import deleteThemeReducer from "./slices/theme/deleteThemeSlice";
import createSubcategoryReducer from "./slices/subcategory/createSubcategorySlice";
import fetchSubcategoriesReducer from "./slices/subcategory/fetchSubcategoriesSlice";
import fetchSubcategoryByIdReducer from "./slices/subcategory/fetchSubcategoryByIdSlice";
import deleteSubcategoryReducer from "./slices/subcategory/deleteSubcategorySlice";
import createCategoryReducer from "./slices/category/createCategorySlice";
import fetchCategoriesReducer from "./slices/category/fetchCategoriesSlice";
import fetchCategoryByIdReducer from "./slices/category/fetchCategoryByIdSlice";
import deleteCategoryReducer from "./slices/category/deleteCategorySlice";
import createNotificationReducer from "./slices/notification/createNotificationSlice";
import fetchNotificationsReducer from "./slices/notification/fetchNotificationsSlice";
import fetchNotificationByIdReducer from "./slices/notification/fetchNotificationByIdSlice";
import deleteNotificationReducer from "./slices/notification/deleteNotificationSlice";
import createOrganizationalUnity from "./slices/organizationalUnity/createOrganizationalUnitySlice";
import fetchOrganizationalUnitiesReducer from "./slices/organizationalUnity/fetchOrganizationalUnitiesSlice";
import fetchOrganizationalUnityByIdReducer from "./slices/organizationalUnity/fetchOrganizationalUnityByIdSlice";
import deleteOrganizationalUnityReducer from "./slices/organizationalUnity/deleteOrganizationalUnitySlice";
import createPriorityReducer from "./slices/priority/createPrioritySlice";
import fetchPrioritiesReducer from "./slices/priority/fetchPrioritiesSlice";
import fetchPriorityByIdReducer from "./slices/priority/fetchPriorityByIdSlice";
import deletePriorityReducer from "./slices/priority/deletePrioritySlice";
import createResponsibleReducer from "./slices/responsible/createResponsibleSlice";
import fetchResponsiblesReducer from "./slices/responsible/fetchResponsiblesSlice";
import fetchResponsibleByIdReducer from "./slices/responsible/fetchResponsibleByIdSlice";
import deleteResponsibleReducer from "./slices/responsible/deleteResponsibleSlice";
import createNotifyingServiceReducer from "./slices/notifyingService/createNotifyingServiceSlice";
import fetchNotifyingServicesReducer from "./slices/notifyingService/fetchNotifyingServicesSlice";
import fetchNotifyingServiceByIdReducer from "./slices/notifyingService/fetchNotifyingServiceByIdSlice";
import deleteNotifyingServiceReducer from "./slices/notifyingService/deleteNotifyingServiceSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    activation: activationReducer,
    passwordReset: passwordResetReducer,
    createUser: createUserReducer,
    users: fetchUsersReducer,
    userDetails: fetchUserByIdReducer,
    deleteUser: deleteUserReducer,
    createHospital: createHospitalReducer,
    hospitals: fetchHospitalsReducer,
    hospitalDetails: fetchHospitalByIdReducer,
    deleteHospital: deleteHospitalReducer,
    createIncident: createIncidentReducer,
    incidents: fetchIncidentsReducer,
    incidentDetails: fetchIncidentByIdReducer,
    deleteIncident: deleteIncidentReducer,
    createTheme: createThemeReducer,
    themes: fetchThemesReducer,
    themeDetails: fetchThemeByIdReducer,
    deleteTheme: deleteThemeReducer,
    createSubcategory: createSubcategoryReducer,
    subcategories: fetchSubcategoriesReducer,
    subcategoryDetails: fetchSubcategoryByIdReducer,
    deleteSubcategory: deleteSubcategoryReducer,
    createCategory: createCategoryReducer,
    categories: fetchCategoriesReducer,
    categoryDetails: fetchCategoryByIdReducer,
    deleteCategory: deleteCategoryReducer,
    createNotification: createNotificationReducer,
    notifications: fetchNotificationsReducer,
    notificationDetails: fetchNotificationByIdReducer,
    deleteNotification: deleteNotificationReducer,
    createOrganizationalUnity: createOrganizationalUnity,
    organizationalUnities: fetchOrganizationalUnitiesReducer,
    organizationalUnityDetails: fetchOrganizationalUnityByIdReducer,
    deleteOrganizationalUnity: deleteOrganizationalUnityReducer,
    createPriority: createPriorityReducer,
    priorities: fetchPrioritiesReducer,
    priorityDetails: fetchPriorityByIdReducer,
    deletePriority: deletePriorityReducer,
    createResponsible: createResponsibleReducer,
    responsibles: fetchResponsiblesReducer,
    responsibleDetails: fetchResponsibleByIdReducer,
    deleteResponsible: deleteResponsibleReducer,
    createNotifyingService: createNotifyingServiceReducer,
    notifyingServices: fetchNotifyingServicesReducer,
    notifyingServiceDetails: fetchNotifyingServiceByIdReducer,
    deleteNotifyingService: deleteNotifyingServiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
