import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";
dotenv.config();

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
});

export const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
      ],
    });
    await client.send(command);
    res.json({ message: "Signup successful. Please check your email for confirmation code." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const confirmSignup = async (req, res) => {
  const { username, code } = req.body;
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
    });
    await client.send(command);
    res.json({ message: "Account confirmed successfully." });
  } catch (err) {
    console.error("Confirmation error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });
    const response = await client.send(command);
    // Optionally set an HttpOnly cookie with the token (uncomment if desired).
    // res.cookie('token', response.AuthenticationResult.IdToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 });
    res.json({
      message: "Login successful",
      token: response.AuthenticationResult.IdToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear cookie named 'token' (if set)
    res.clearCookie("token", { path: "/" });
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: err.message });
  }
};
