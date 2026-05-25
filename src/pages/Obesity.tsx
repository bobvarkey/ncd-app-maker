import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Obesity() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/obesity/bmi-calculator", { replace: true });
  }, [navigate]);
  return null;
}
