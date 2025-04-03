import {
  bagOutline,
  brushOutline,
  carOutline,
  cutOutline,
  homeOutline,
  logOutOutline,
  manOutline,
  medicalOutline,
  notificationsOutline,
  peopleCircleOutline,
  personAddOutline,
  warningOutline,
} from "ionicons/icons";

export interface SideMenuPages {
  url: string;
  icon: string;
  title: string;
}

export const sideMenuPages: SideMenuPages[] = [
  {
    title: "Home",
    url: "/home",
    icon: homeOutline,
  },
  {
    title: "Cadastrar Usuário",
    url: "/users/create",
    icon: personAddOutline,
  },
  {
    title: "Listar Usuários",
    url: "/users",
    icon: peopleCircleOutline,
  },
  {
    title: "Cadastrar Hospital",
    url: "/hospitals/create",
    icon: medicalOutline,
  },
  {
    title: "Listar Hospitais",
    url: "/hospitals",
    icon: medicalOutline,
  },
  {
    title: "Notificações",
    url: "/notifications",
    icon: notificationsOutline,
  },
  {
    title: "Cadastrar Notificação",
    url: "/notifications/create",
    icon: notificationsOutline,
  },
  {
    title: "Temas",
    url: "/themes",
    icon: brushOutline,
  },
  {
    title: "Cadastrar Temas",
    url: "/themes/create",
    icon: brushOutline,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: bagOutline,
  },
  {
    title: "Cadastrar Categorias",
    url: "/categories/create",
    icon: bagOutline,
  },
  {
    title: "Subcategorias",
    url: "/subcategories",
    icon: carOutline,
  },
  {
    title: "Cadastrar Subcategorias",
    url: "/subcategories/create",
    icon: carOutline,
  },
  {
    title: "Incidentes",
    url: "/incidents",
    icon: cutOutline,
  },
  {
    title: "Cadastrar Incidentes",
    url: "/incidents/create",
    icon: cutOutline,
  },
  {
    title: "Responsáveis",
    url: "/responsibles",
    icon: manOutline,
  },
  {
    title: "Cadastrar Responsáveis",
    url: "/responsibles/create",
    icon: manOutline,
  },
  {
    title: "Prioridades",
    url: "/priorities",
    icon: warningOutline,
  },
  {
    title: "Cadastrar Prioridades",
    url: "/priorities/create",
    icon: warningOutline,
  },
  // {
  //   title: "Serviços Notificantes",
  //   url: "/hospitals",
  //   icon: medicalOutline,
  // },
  {
    title: "Unidades Organizacionais",
    url: "/organizational-unities",
    icon: medicalOutline,
  },
  {
    title: "Cadastrar Unidades Organizacionais",
    url: "/organizational-unities/create",
    icon: medicalOutline,
  },
  {
    title: "Logout",
    url: "/login",
    icon: logOutOutline,
  },
];
