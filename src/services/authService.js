import { loginApi, signUpApi, roleApi } from "../api/authApi";

export const handleSignUp = async (
  signUpData,
  setShowSignUp,
  setShowSignUpSuccess,
  setSignUpData
) => {
  try {
    const response = await signUpApi(signUpData);
    if (response) {
      console.log("Sign up successful.");
      setShowSignUp(false);
      setSignUpData({ name: "", email: "", password: "" });
      setShowSignUpSuccess(true);
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    alert("Sign Up failed. Please try again.");
  }
};

export const handleLogin = async (loginData, setLoginData, navigate) => {
  try {
    const response = await loginApi(loginData);
    if (response) {
      console.log("Login successful.");
      setLoginData({ email: "", password: "" });

      const { data } = await roleApi(loginData.email);
      if (data?.includes("DRIVER") && data?.includes("RIDER")) {
        navigate("/driverdashboard");
      } else if (data?.includes("RIDER")) {
        navigate("/riderdashboard");
      }
    } else {
      alert("Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed.");
  }
};
