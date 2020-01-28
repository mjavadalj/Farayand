import Vue from "vue";
import Router from "vue-router";
import TeacherLayout from "@/components/Layout/teacherLayout";
import UserLayout from "@/components/Layout/userLayout";
import Layout from "@/components/Layout/Layout";
import ErrorPage from "@/pages/Error/Error";

//teacher
import Teacher from "@/pages/admin/teacher";
//certificate
// import Certificate from "@/pages/admin/certificate";
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
import CheckCertificates from "./pages/admin/checkCertificate.vue";
import teacherCheckCertificates from "./pages/teacher/checkCertificate.vue";
import TPCourse from "./pages/teacher/teacherPublishableCourses.vue";
import TeacherCourses from "./pages/teacher/teacherCourses.vue";
import SignUp from "./pages/Login/signup.vue";
import Edit from "./pages/edit/edit.vue";
import landing_page from "./pages/landing_page.vue";
import cert from "./pages/certificate.vue";
import checkConfirmed from "./pages/admin/checkConfirmed.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/cert",
      name: "cert",
      component: cert
    },
    {
      path: "/landing",
      name: "landing",
      component: landing_page
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp
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
          path: "checkConfirmed",
          name: "checkConfirmed",
          component: checkConfirmed
        },
        {
          path: "check",
          name: "check",
          component: CheckCertificates
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
          path: "teacher",
          name: "teacher",
          component: Teacher
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
          path: "mycourse",
          name: "mycourse",
          component: ChosenCourses
        },
        {
          path: "quiz",
          name: "teacherQuiz",
          component: Quiz
        },
        {
          path: "check",
          name: "tcert",
          component: teacherCheckCertificates
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
