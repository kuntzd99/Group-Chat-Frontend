import { createWebHistory, createRouter } from 'vue-router'
import LandingPage from './pages/LandingPage'
// import LoginComponent from './components/LoginComponent'
// import RegisterComponent from './components/RegisterComponent'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import ProfilePage from './pages/ProfilePage'

const routes = [
  { path: '/', component: LandingPage, name: 'LandingPage' },
  { path: '/home/:user_id', component: HomePage, name: 'HomePage' },
  {
    path: '/groups/:user_id/:group_id',
    component: GroupPage,
    name: 'GroupPage'
  },
  {
    path: '/profile/:user_id/:profile_id',
    component: ProfilePage,
    name: 'ProfilePage'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
