import { getKeycloakInstance, getAdminToken } from '../config/keycloakConfig.js';
import axios from 'axios';


export const loginUser = async (username, password) => {
  const keycloak = getKeycloakInstance();
  try {
    const grant = await keycloak.grantManager.obtainDirectly(username, password);

    return {
      accessToken: grant.access_token.token,
      refreshToken: grant.refresh_token.token,
      userId: grant.access_token.content.sub,
      roles: grant.access_token.content?.realm_access?.roles || [],
    };
  } catch (error) {
    console.error('Error obtaining token:', error);
    throw new Error('Invalid credentials');
  }
};

// Reemplaza tu logoutUserService actual con esta versión completa

export const logoutUserService = async (refreshToken) => {
  try {
    // Esta es la URL estándar de OpenID Connect para logout.
    const logoutUrl = `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`;

    // Le decimos a Keycloak que cierre la sesión asociada a este refresh_token.
    await axios.post(
      logoutUrl,
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
  } catch (error) {
    // Si Keycloak da un error (ej. el token ya era inválido), no es crítico.
    // El objetivo es que el usuario sea deslogueado del frontend.
    console.error('Keycloak logout failed, possibly because the token was already invalid:', error.response?.data || error.message);
    // No relanzamos el error para que el controlador pueda limpiar la cookie de todos modos.
  }
};

export const getUserSessions = async (userId) => {
  const realm = process.env.KEYCLOAK_REALM;
  const adminToken = await getAdminToken();

  const sessionsUrl = `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${realm}/users/${userId}/sessions`;

  const response = await axios.get(sessionsUrl, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data; 
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `${process.env.KEYCLOAK_SERVER_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token, 
      expiresIn: response.data.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw new Error('Refresh token failed');
  }
};
