import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; email: string; role: string; avatar?: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
isAuthenticated: !!localStorage.getItem("token"),
  login: async (email: string, password: string) => {
  try {
    const response = await fetch("https://swms-poject.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

    set({
      user: {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      },
      isAuthenticated: true,
    });
  } catch (error) {
    console.error(error);
    alert("Invalid email or password");
  }
},
  logout: () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  set({
    user: null,
    isAuthenticated: false,
  });
},
}));
