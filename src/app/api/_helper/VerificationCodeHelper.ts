export const genrateVerificationCode = () : string => {
    return (Math.floor(Math.random() * 100000) + 900000).toString();
}
export const genrateVerificationCodeExpiry = ():Date =>{
    return new Date(Date.now() + 10 * 60 * 1000);
}