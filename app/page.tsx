"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { Righteous } from "next/font/google";

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
});

export default function Page() {
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [created, setcreated] = useState(false);
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const capitalizeFirst = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city, email, password }),
    });

    if (res.ok) {
      setcreated(true);
      setIsRegister(false);
      setName("");
      setCity("");
      setEmail("");
      setPassword("");
    } else {
      const err = await res.text();
      alert(err);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      window.location.href = "/chat"; // You can change this to the homepage or dashboard
    } else {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div className="grid h-screen tracking-[1px] py-2 pr-2 lg:grid-cols-2 grid-rows-1">
      <div className="flex justify-center items-center">
        <div className="w-7/10">
          <h1 className="text-[48px] mb-5 w-full font-bold">
            {isRegister ? "Create Account" : "Welcome Back!"}
          </h1>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && (
              <>
                <h3 className="text-[17px]">Name:</h3>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(capitalizeFirst(e.target.value))}
                  placeholder="Enter your full name"
                  className="w-full text-[17px] p-3 mt-2 mb-4 rounded-[5px] border-[1px] focus:outline-none border-black/25"
                />
              </>
            )}
            {isRegister && (
              <>
                <h3 className="text-[17px]">City:</h3>
                <input
                  type="text"
                  value={city}
                  required
                  onChange={(e) => setCity(capitalizeFirst(e.target.value))}
                  placeholder="Enter your city"
                  className="w-full text-[17px] p-3 mt-2 mb-4 rounded-[5px] focus:outline-none border-[1px] border-black/25"
                />
              </>
            )}

            <h3 className="text-[17px]">Email:</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your @gmail.com"
              className="w-full text-[17px] p-3 mt-2 mb-4 rounded-[5px] focus:outline-none border-[1px] border-black/25"
            />
            <h3 className="text-[17px]">Password:</h3>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full text-[17px] p-3 pr-12 mt-2 mb-4 rounded-[5px] focus:outline-none border-[1px] border-black/25"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
              >
                {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
              </button>
            </div>

            {!isRegister && (
              <>
                {isVisible && (
                  <div className="mb-2 text-red-600">Invalid Credentials</div>
                )}
              </>
            )}
            {isRegister && (
              <>
                {created && (
                  <div className="mb-2 text-green-600">
                    Account Created! Now login
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full p-2 h-[58px] text-[21px] mt-2 mb-4 font-bold text-white bg-[#FDC500] rounded-[5px] hover:bg-[#fdbb00]"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <hr className="my-6 border-t-1 border-black/25" />

          <div className="flex flex-col items-center">
            <p className="text-[18px]">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-[#FDC500] hover:underline font-bold"
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="h-full flex justify-center items-center w-full bg-[#FDC500]">
        <h1 className={`${righteous.className} text-[96px] text-white`}>
          CHAT TIME
        </h1>
      </div>
    </div>
  );
}
