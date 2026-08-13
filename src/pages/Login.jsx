import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "../assets/images/icon.png";
import { loginAdmin } from "@/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      setLoading(true);
      const response = await loginAdmin(data);
      localStorage.setItem("4ZbFyedjehdkdfefejkhj", response?.data?.token);
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("4ZbFyedjehdkdfefejkhj")) {
      navigate({ to: "/dashboard" });
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFBEB] via-[#FFFEF5] to-[#FFFFFF]">
      <img src={Logo} alt="Logo" className="w-16 h-16 mb-4" />
      <h2 className="text-lg font-semibold text-gray-800">Admin Login</h2>
      <p className="text-gray-500 mb-6">Access True Legacy admin panel</p>

      <Card className="w-full max-w-md shadow-md rounded-xl">
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#EACD6D] hover:bg-[#d7b856] text-black font-medium"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
