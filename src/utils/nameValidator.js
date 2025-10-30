export const isValidName = (name) => {
    if (!name){
        return false;
    }
    const nameRegex = /^[a-zA-Z\u00C0-\u017F\s]+$/;
    return nameRegex.test(name)
}