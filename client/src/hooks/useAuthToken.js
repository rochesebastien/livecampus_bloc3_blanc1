import { useState, useEffect } from 'react';

const useAuthToken = () => {
    const [token, setToken] = useState(getCookie('token'));

    useEffect(() => {
        const storedToken = getCookie('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const saveToken = (newToken) => {
        setCookie('token', newToken);
        setToken(newToken);
    };

    const removeToken = () => {
        deleteCookie('token');
        setToken(null);
    };

    const setCookie = (name, value) => {
        document.cookie = `${name}=${value};expires=86400;path=/`;
    };

    const getCookie = (name) => {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    };

    const deleteCookie = (name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    };

    return {
        token,
        saveToken,
        removeToken,
    };
};

export default useAuthToken;