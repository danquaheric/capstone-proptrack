export function roleHome(role) {
  if (role === "LANDLORD") return "/landlord";
  if (role === "ADMIN") return "/admin";
  return "/tenant";
}
