import axios from "axios";
const url = import.meta.env.VITE_BASE_URL;

export function getCookie(name) {
  let cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookie ? cookie.split("=")[1] : null;
}

export async function addUser(name, surname, email, id) {
  const newUser = {
    id,
    name,
    surname,
    email,
    createdAt: Date.now(),
    img: `https://api.multiavatar.com/${name}`,
  };
  try {
    await axios.post(`${url}/users.json`, { ...newUser });
  } catch (e) {
    console.log(e);
  }
}

export async function addTransaction(description, userId) {
  const transaction = {
    date: Date(Date.now()),
    description,
    userId,
  };

  try {
    await axios.post(`${url}/transactions.json`, {
      ...transaction,
    });
  } catch (e) {
    console.log(e);
  }
}
