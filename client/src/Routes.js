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
import Teacher from "@/pages/admin/teacher";
//certificate
import Certificate from "@/pages/admin/certificate";
//Admin course
import Course from "@/pages/admin/course";
import ChosenCourses from "@/pages/teacher/chosenCourses";
//Admin lesson
import Lesson from "@/pages/admin/lesson";
import studentRegLesson from "@/pages/student/reg_lesson";
import teacherRegLesson from "@/pages/teacher/reg_lesson";
//Admin session
import Session from "@/pages/admin/session";
import Student from "./pages/admin/student.vue";
import Question from "./pages/admin/question.vue";
import Home from "./pages/student/home.vue";
import Quiz from "./pages/quiz/quiz.vue";
import Uni from "./pages/admin/uni.vue";
import AdminMain from "./pages/admin/adminMain.vue";
import TPCourse from "./pages/teacher/teacherPublishableCourses.vue";
import TeacherCourses from "./pages/teacher/teacherCourses.vue";
import Geo from "./pages/admin/geo.vue";
import SignUp from "./pages/Login/signup.vue";
import Edit from "./pages/edit/edit.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/signup",
      name: "signup",
      component: SignUp
    },
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
          path: "geo",
          name: "geo",
          component: Geo
        },
        {
          path: "main",
          name: "adminMain",
          component: AdminMain
        },
        {
          path: "universities",
          name: "uni",
          component: Uni
        },
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
          path: "edit",
          name: "teacherEdit",
          component: Edit
        },
        {
          path: "mylesson",
          name: "mylesson",
          component: teacherRegLesson
        },
        {
          path: "course",
          name: "teacherCourses",
          component: TeacherCourses
        },
        {
          path: "tpcourse",
          name: "tpcourse",
          component: TPCourse
        },
        {
          path: "main",
          name: "teacherMain",
          component: AdminMain
        },
        {
          path: "question/:title",
          name: "tquestion",
          component: Question
        },
        {
          path: "mycourse",
          name: "mycourse",
          component: ChosenCourses
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
        },
        {
          path: "/certificate",
          name: "certificate",
          component: Certificate
        },
        {
          path: "/quiz",
          name: "teacherQuiz",
          component: Quiz
        }
      ]
    },
    {
      path: "/",
      name: "userLayout",
      component: UserLayout,
      children: [
        {
          path: "edit",
          name: "studentEdit",
          component: Edit
        },
        {
          path: "main",
          name: "studentMain",
          component: AdminMain
        },
        {
          path: "/home",
          name: "home",
          component: Home
        },
        {
          path: "/mylesson",
          name: "reg_lesson",
          component: studentRegLesson
        },
        {
          path: "/quiz",
          name: "studentQuiz",
          component: Quiz
        }
      ]
    }
  ]
});
