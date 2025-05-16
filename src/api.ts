const API_BASE = import.meta.env.VITE_SERVER_URL;

const Register = API_BASE + "/auth/register";
const Login = API_BASE + "/auth/login";
const Profile = API_BASE + "/auth";
const UserLogin = API_BASE + "/auth";

export { Register, Login, Profile, UserLogin };
