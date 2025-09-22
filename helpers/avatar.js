import gravatar from "gravatar";

export const createAvatarUrl = async (email) =>
  gravatar.url(email, { protocol: "http" });

export const getAvatarUrl = async (host, filename) =>
  `http://${host}/avatars/${filename}`;
