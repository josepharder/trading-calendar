import BaseTemplate from '@/components/BaseTemplate.vue';
import { createRouter, createWebHistory } from 'vue-router';
import CalendarPage from '@/views/CalendarPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseTemplate,
      children: [
        {
          path: '',
          name: 'calendar',
          component: CalendarPage
        }
      ]
    }
  ]
});

export default router;
