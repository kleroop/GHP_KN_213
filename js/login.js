document.addEventListener('DOMContentLoaded', () => {
    const login_form = document.getElementById('login-form');
    login_form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target.elements;
        let resp;
        let res;
        try {
            resp = await api_login(form.username.value, form.password.value);
            res = await resp.json();
        } catch (err) {
            app_notification('No internet connection');
            return false;
        }
        if (!resp.ok) {
            app_notification(res.description);
            return false;
        }
        console.log(resp);
        await app_login(res.token1);
        window.location.href = '/home.html';
        return false;
    });
});
