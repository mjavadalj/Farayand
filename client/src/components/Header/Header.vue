<template>
  <b-navbar class="header d-print-none">
    <b-nav>
      <b-nav-item>
        <a class="d-md-down-none px-2" href="#" @click="toggleSidebarMethod" id="barsTooltip">
          <i class='la la-bars la-lg' />
        </a>
        <!-- <b-tooltip target="barsTooltip" placement="bottom">
          Turn on/off <br> sidebar <br> collapsing
        </b-tooltip> -->
        <!-- <a class="fs-lg d-lg-none" href="#" @click="switchSidebarMethod">
          <span class="rounded rounded-lg bg-gray text-white d-md-none">
            <i class="la la-bars la-lg" />
          </span>
          <i class="la la-bars la-lg d-sm-down-none ml-4" />
        </a> -->
      </b-nav-item>
    </b-nav>
    
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import $ from 'jquery';
import Notifications from '@/components/Notifications/Notifications';

export default {
  name: 'Headed',
  components: { Notifications },
  computed: {
    ...mapState('layout', {
      sidebarClose: state => state.sidebarClose,
      sidebarStatic: state => state.sidebarStatic,
    }),
  },
  methods: {
    ...mapActions('layout', ['toggleSidebar', 'toggleChat', 'switchSidebar', 'changeSidebarActive']),
    switchSidebarMethod() {
      if (!this.sidebarClose) {
        this.switchSidebar(true);
        this.changeSidebarActive(null);
      } else {
        this.switchSidebar(false);
        const paths = this.$route.fullPath.split('/');
        paths.pop();
        this.changeSidebarActive(paths.join('/'));
      }
    },
    toggleSidebarMethod() {
      if (this.sidebarStatic) {
        this.toggleSidebar();
        this.changeSidebarActive(null);
      } else {
        this.toggleSidebar();
        const paths = this.$route.fullPath.split('/');
        paths.pop();
        this.changeSidebarActive(paths.join('/'));
      }
    },
    logout() {
      window.localStorage.setItem('authenticated', false);
      this.$router.push('/landing');
    },
  },
  created() {
    if (window.innerWidth > 576) {
      setTimeout(() => {
        const $chatNotification = $('#chat-notification');
        $chatNotification.removeClass('hide').addClass('animated fadeIn')
          .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            $chatNotification.removeClass('animated fadeIn');
            setTimeout(() => {
              $chatNotification.addClass('animated fadeOut')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd'
                + ' oanimationend animationend', () => {
                  $chatNotification.addClass('hide');
                });
            }, 6000);
          });
        $chatNotification.siblings('#toggle-chat')
          .append('<i class="chat-notification-sing animated bounceIn"></i>');
      }, 4000);
    }
  },
};
</script>

<style src="./Header.scss" lang="scss" scoped />
