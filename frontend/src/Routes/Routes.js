import HomePage from '~/Pages/HomePage/Homepage';
import Nest from '~/Pages/Nest/Nest';
import ParrotProduct from '~/Pages/ParrotProduct/ParrotProduct';
import AdParrotSpecies from '~/Pages/AdParrotSpecies/AdParrotSpecies';
import SystemLayout from '~/Components/SystemLayout/SystemLayout';

//Dành cho những người kể cả đăng nhập hay không đăng nhập cũng coi được
const publicRoutes = [
    { path: '/', component: HomePage },
    { path: '/parrotProduct', component: ParrotProduct },
    { path: '/nest', component: Nest },
    { path: '/maParrotSpecies', component: AdParrotSpecies, layout: SystemLayout },
];

//Dành cho những người đăng nhập mới coi được
const privateRoutes = [];

export { publicRoutes, privateRoutes };
