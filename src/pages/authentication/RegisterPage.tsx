import { useState } from "react";
import { useLocation } from "wouter";

export default function RegisterPage() {
  const [, navigate] = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-[420px]"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-3 mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
  className="w-full border rounded-lg p-3 mb-6"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="admin">Admin</option>
  <option value="manager">Manager</option>
  <option value="staff">Staff</option>
  <option value="employee">Employee</option>
</select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700"
        >
          Create Account
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}