<template lang="">
<div class="text-center">
        <div class="text-center">
    </div>
        <div style="margin-top:-40px;">
          <img src="../../assets/image/rahbar.jpg" width="1000px"  class="img-fluid" alt="Responsive image">
        </div>
    </div>
</template>
<script>
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger"; // eslint-disable-line
import Widget from "@/components/Widget/Widget";

const { Messenger } = window;

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
/* eslint-enable *//* eslint-disable */

export default {
  name: "Notifications",
  components: { Widget },
  data() {
    return {
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right"
    };
  },
  methods: {
    addSuccessNotification() {
      Messenger().post({
        extraClasses: this.locationClasses,
        message: "شما با موفقیت شدید",
        type: "success",
        showCloseButton: true
      });
      return false;
    },
    addInfoNotification() {
      const msg = Messenger().post({
        extraClasses: this.locationClasses,
        message: "Launching thermonuclear war...",
        actions: {
          cancel: {
            label: "cancel launch",
            action: () =>
              msg.update({
                message: "Thermonuclear war averted",
                type: "success",
                actions: false
              })
          }
        }
      });

      return false;
    },
    addErrorNotification() {
      let i = 0;
      Messenger().run({
        errorMessage: "Error destroying alien planet",
        successMessage: "Alien planet destroyed!",
        extraClasses: this.locationClasses,
        action(opts) {
          /* eslint-disable */
          if (++i < 3) {
            return opts.error({
              status: 500,
              readyState: 0,
              responseText: 0
            });
          }
          /* eslint-enable *//* eslint-disable */
          return opts.success();
        }
      });
    },
    toggleLocation(vertical = "top", horizontal = "") {
      let className = `messenger-fixed messenger-on-${vertical}`;
      className += horizontal === "" ? "" : ` messenger-on-${horizontal}`;
      this.locationClasses = className;
      Messenger.options = {
        extraClasses: className,
        theme: "air"
      };
      Messenger();
    }
  },
  created() {
    initializationMessengerCode();
    Messenger.options = {
      extraClasses: this.locationClasses,
      theme: "air"
    };
    this.addSuccessNotification();
  }
};
</script>

<style src="./Notifications.scss" lang="scss" scoped />