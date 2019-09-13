import Vue from "vue";
import Router from "vue-router";
import TeacherLayout from "@/components/Layout/teacherLayout";
import UserLayout from "@/components/Layout/userLayout";
import Layout from "@/components/Layout/Layout";
import Login from "@/pages/Login/Login";
import ErrorPage from "@/pages/Error/Error";
// Core
import TypographyPage from "@/pages/Typography/Typography";

// Tables
import TablesBasicPage from "@/pages/Tables/Basic";

// Maps
import GoogleMapPage from "@/pages/Maps/Google";

// Main
import AnalyticsPage from "@/pages/Dashboard/Dashboard";

// Charts
import ChartsPage from "@/pages/Charts/Charts";

// Ui
import IconsPage from "@/pages/Icons/Icons";
import NotificationsPage from "@/pages/Notifications/Notifications";
//teacher
import Teacher from "@/pages/teacher/teacher";
//certificate
import Certificate from "@/pages/certificate/certificate";
//Admin course
import Course from "@/pages/course/course";
import TCourse from "@/pages/course/teacherCourse";
//Admin lesson
import Lesson from "@/pages/lesson/lesson";
import RgLesson from "@/pages/lesson/reg_lesson";
//Admin session
import Session from "@/pages/session/session";

import Student from "./pages/students/student.vue";
import Question from "./pages/question/question.vue";
import Home from "./pages/home/home.vue";
import Quiz from "./pages/quiz/quiz.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/error",
      name: "Error",
      component: ErrorPage
    },
    {
      path: "/app",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "question/:title",
          name: "question",
          component: Question
        },
        {
          path: "session/:title",
          name: "session",
          component: Session
        },
        {
          path: "lesson/:title",
          name: "lesson",
          component: Lesson
        },
        {
          path: "course",
          name: "course",
          component: Course
        },
        {
          path: "dashboard",
          name: "AnalyticsPage",
          component: AnalyticsPage
        },
        {
          path: "typography",
          name: "TypographyPage",
          component: TypographyPage
        },
        {
          path: "teacher",
          name: "teacher",
          component: Teacher
        },
        {
          path: "certificate",
          name: "certificate",
          component: Certificate
        },
        {
          path: "components/icons",
          name: "IconsPage",
          component: IconsPage
        },
        {
          path: "notifications",
          name: "NotificationsPage",
          component: NotificationsPage
        },
        {
          path: "components/charts",
          name: "ChartsPage",
          component: ChartsPage
        },
        {
          path: "tables",
          name: "TablesBasicPage",
          component: TablesBasicPage
        },
        {
          path: "components/maps",
          name: "GoogleMapPage",
          component: GoogleMapPage
        },
        {
          path: "student",
          name: "student",
          component: Student
        }
      ]
    },
    {
      path: "/teacher",
      name: "teacherLayout",
      component: TeacherLayout,
      children: [
        {
          path: "question/:title",
          name: "tquestion",
          component: Question
        },
        {
          path: "course",
          name: "course",
          component: TCourse
        },
        {
          path: "lesson/:title",
          name: "tlesson",
          component: Lesson
        },
        {
          path: "session/:title",
          name: "tsession",
          component: Session
        }
      ]
    },
    {
      path: "/",
      name: "userLayout",
      component: UserLayout,
      children: [
        {
          path: "/home",
          name: "home",
          component: Home
        },
        {
          path:"/mylesson",
          name:"reg_lesson",
          component:RgLesson
        },
        {
          path:"/quiz",
          name:"quiz",
          component:Quiz
        }
        ,
        {
          path:"/certificate",
          name:"certificate",
          component:Certificate
        }
      ]
    }
  ]
});
