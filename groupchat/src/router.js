import { createWebHistory, createRouter } from 'vue-router'
import LandingPage from './pages/LandingPage'
// import LoginComponent from './components/LoginComponent'
// import RegisterComponent from './components/RegisterComponent'
import HomePage from './pages/HomePage'

const routes = [
  { path: '/', component: LandingPage, name: 'LandingPage' },
  // { path: '/login', component: LoginComponent, name: 'LoginComponent' },
  // {
  //   path: '/register',
  //   component: RegisterComponent,
  //   name: 'RegisterComponent'
  // },
  { path: '/home/:user_id', component: HomePage, name: 'HomePage' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
