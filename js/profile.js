document.addEventListener('DOMContentLoaded', () => {
    const login_form = document.getElementById('change-password-form');
    login_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target.elements;
        if (form.newpassword1.value !== form.newpassword2.value) {
            app_notification('Passwords don\'t match!');
            return false;
        }
        let resp, res;
        try {
            resp = await api_chpassword(form.password.value, form.newpassword1.value);
            res = await resp.json();
        } catch (err) {
            app_notification('Network error');
            return false;
        }
        if (!resp.ok) {
            app_notification(res.description);
            return false;
        }

        return false;
    });
});
