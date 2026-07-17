import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const t = (key: string, translations: Record<string, string>) => translations[key] || key;

const makeTranslation = (
  title: string, subtitle: string, description: string,
  dashboard: string, navigation: string, transport: string,
  sustainability: string, admin: string, login: string,
  crowd: string, incidents: string, volunteer: string,
  fanExp: string, logout: string, welcome: string
) => ({
  translation: {
    app: { title, subtitle, description },
    nav: { dashboard, navigation, transport, sustainability, admin, login, crowd, incidents, volunteer, fanExperience: fanExp, logout },
    hero: { welcome }
  }
});

const resources = {
  en: makeTranslation('StadiumFlow AI','AI-powered stadium operations','A multilingual command center for crowd flow, navigation, transport, sustainability and incident response.','Dashboard','Navigation','Transport','Sustainability','Admin','Login','Crowd Pulse','Incidents','Volunteer','Fan Experience','Logout','Welcome'),
  es: makeTranslation('StadiumFlow AI','Operaciones de estadio con IA','Un centro de mando multilingüe para flujo de multitudes, navegación, transporte, sostenibilidad y respuesta a incidentes.','Panel','Navegación','Transporte','Sostenibilidad','Administrador','Iniciar sesión','Pulso de Multitud','Incidentes','Voluntario','Experiencia del Fan','Cerrar sesión','Bienvenido'),
  fr: makeTranslation('StadiumFlow AI','Opérations de stade alimentées par IA','Un centre de commande multilingue pour le flux de foule, la navigation, le transport, la durabilité et la réponse aux incidents.','Tableau de bord','Navigation','Transport','Durabilité','Administrateur','Connexion','Pouls de foule','Incidents','Bénévole','Expérience Fan','Déconnexion','Bienvenue'),
  // Add other languages as needed
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
