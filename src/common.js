export function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
}

export function app_notification(message, timeout = 5000) {
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

export const BASE_URL = 'http://localhost:8080';

export async function create_request(url, method, params) {
    url = `${BASE_URL}${url}`;
    let jwt = localStorage.getItem('admin_jwt');
    if (jwt === null) jwt = localStorage.getItem('jwt');
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${jwt}`
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

export async function api_register(username, password) {
    return create_request('/user', 'POST', {username, password});
}

export async function api_login(username, password) {
    return create_request('/user/login', 'GET', {username, password});
}

export async function api_logout() {
    return create_request('/user/logout', 'GET');
}

export async function api_deluser() {
    return create_request('/user', 'DELETE');
}

export async function api_chpassword(passwd, newpassword) {
    return create_request('/user/chpassword', 'POST', {password: passwd, newpassword});
}


export async function app_logout() {
    if (localStorage.getItem('jwt')) await api_logout();
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_id');
}


export async function app_login(username, password) {
    let resp, res;
    try {
        resp = await api_login(username, password);
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
    const p = parseJwt(res.token1);
    if (app_getuser()) {
        await app_logout();
    }
    localStorage.setItem('jwt', res.token1);
    localStorage.setItem('user_id', p.sub);
    localStorage.setItem('username', username);
    return true;
}

export function app_getuser() {
    if (localStorage.getItem('jwt') === null) {
        return null;
    }
    const r = parseJwt(localStorage.getItem('jwt'));
    console.log(r);
    return r;
}

export async function api_admin_login(username) {
    return create_request('/admin/login', 'GET', {username});
}

export async function app_admin_login(username) {
    let resp, res;
    try {
        resp = await api_admin_login(username);
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
    const p = parseJwt(res.token1);
    if (app_getuser()) {
        await app_logout();
    }
    localStorage.setItem('jwt', res.token1);
    localStorage.setItem('user_id', p.sub);
    localStorage.setItem('username', p.username);
    return true;
}

export async function api_user_stats(id) {
    return create_request(`/user/${id}`, 'GET');
}

export async function api_user_from_username(username) {
    return create_request(`/username/${username}`, 'GET');
}


export async function api_get_memo(id) {
    return create_request(`/memo/${id}`, 'GET');
}


export async function api_create_memo(tag, text) {
    return create_request(`/memo`, 'POST', {tag, text});
}

export async function api_edit_memo(id, tag, text) {
    return create_request(`/memo/${id}`, 'PUT', {tag, text});
}


export async function api_delete_memo(id) {
    return create_request(`/memo/${id}`, 'DELETE');
}

export async function api_get_perms(id) {
    return create_request(`/permission/${id}`, 'GET');
}

/**
 *
 * @param id
 * @param access {number[]}
 * @returns {Promise<Response|null>}
 */
export async function api_set_perms(id, access) {
    let s = '';
    if (access.length) s = access.join(',');
    return create_request(`/permission/${id}`, 'PUT', {usersWithAccess: s});
}