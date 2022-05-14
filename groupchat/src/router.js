import { createWebHistory, createRouter } from 'vue-router'
import LandingPage from './pages/LandingPage'
// import LoginComponent from './components/LoginComponent'
// import RegisterComponent from './components/RegisterComponent'
import HomePage from './pages/HomePage'
import GroupPage from './pages/GroupPage'
import ProfilePage from './pages/ProfilePage'
import PostPage from './pages/PostPage'

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
  },
  {
    path: '/posts/:user_id/:post_id',
    component: PostPage,
    name: 'PostPage'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
