import Home from 'components/Home/home';
import People from 'components/People/people';
import Person from 'components/People/person';
import Vehicles from 'components/Vehicles/vehicles';
import NotFound from 'components/NotFound/notFound';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/people',
    component: People
  },
  {
    path: '/people/:id',
    name: 'people',
    component: Person
  },
  {
    path: '/vehicles',
    component: Vehicles
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routes;
