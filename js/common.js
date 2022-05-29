function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
}

function app_notification(message, timeout = 5000) {
    const notification = document.createElement('div');
    const text = document.createTextNode(message);
    const timer = setTimeout(() => {
        document.body.removeChild(notification);
    }, timeout);
    notification.classList.add('head-notification');
    notification.onclick = (e) => {
        clearTimeout(timer);
        document.body.removeChild(e.target);
    };
    notification.appendChild(text);
    document.body.appendChild(notification);
}

async function create_request(url, method, params) {
    url = `http://localhost:8080${url}`;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    };


    switch (method) {
        case 'PUT':
        case 'POST':
        case 'DELETE':
            return fetch(url, {
                method,
                body: new URLSearchParams(params),
                headers

            });

        case 'GET':
            return fetch(`${url}?${new URLSearchParams(params)}`, {
                method: 'GET',
                headers
            });
        default:
            return null;
    }
}

async function api_register(username, password) {
    return create_request('/user', 'POST', {username, password});
}

async function api_login(username, password) {
    return create_request('/user/login', 'GET', {username, password});
}

async function api_logout() {
    return create_request('/user/logout', 'GET');
}

async function api_chpassword(passwd, newpassword) {
    return create_request('/user/chpassword', 'POST', {password: passwd, newpassword});
}


async function app_logout() {
    if (localStorage.getItem('jwt')) await api_logout();
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_id');
}

async function app_login(token) {
    const p = parseJwt(token);
    if (localStorage.getItem('jwt')) {
        await app_logout();
    }
    localStorage.setItem('jwt', token);
    localStorage.setItem('user_id', p.sub);
}
