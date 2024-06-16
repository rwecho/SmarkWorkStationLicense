export const checkUserAuthentication = () => {
    const isLoggedIn = document.cookie.includes('loggedIn=true');
    return isLoggedIn;
}
