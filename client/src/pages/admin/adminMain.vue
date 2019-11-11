<template>
  <div>
    <div class="bg" >
    <img
      src="../../assets/image/rahbar-logo.jpg"
      width="1000px"
      class="img-fluid"
      alt="Responsive image"
    />
  </div>
  </div>
</template>
<script>
/* eslint-disable */
function initializationMessengerCode() {
  (function() {
    let $,
      FlatMessage,
      spinner_template,
      __hasProp = {}.hasOwnProperty,
      __extends = function(child, parent) {
        for (const key in parent) {
          if (__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
          this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      };

    $ = jQuery;

    spinner_template =
      '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';

    FlatMessage = (function(_super) {
      __extends(FlatMessage, _super);

      function FlatMessage() {
        return FlatMessage.__super__.constructor.apply(this, arguments);
      }

      FlatMessage.prototype.template = function(opts) {
        let $message;
        $message = FlatMessage.__super__.template.apply(this, arguments);
        $message.append($(spinner_template));
        return $message;
      };

      return FlatMessage;
    })(Messenger.Message);

    Messenger.themes.air = {
      Message: FlatMessage
    };
  }.call(window));
}
/* eslint-enable */
import Widget from "@/components/Widget/Widget";
import VueJWT from "vuejs-jwt";
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  created() {}
};
</script>

<style>
.bg {
  margin-top:-40px;
  margin-left:130px;
  background:cover;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
