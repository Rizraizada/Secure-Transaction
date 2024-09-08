// helpers/notificationHelper.js
const generateNotificationScript = (type, message) => {
    return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const { notification } = antd;
        notification.${type}({
          message: '${message}',
          placement: 'topRight',
          duration: 5,
        });
      });
    </script>
    `;
};

module.exports = { generateNotificationScript };
