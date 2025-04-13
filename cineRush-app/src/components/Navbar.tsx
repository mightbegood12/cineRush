
const GlassNavbar = () => {
  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto w-[50%] z-50 backdrop-blur-md bg-white/10 rounded-full shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-white text-xl font-bold">CineRush</div>
        <ul className="flex gap-6 text-white font-medium">
          <li className="hover:text-blue-300 cursor-pointer">Home</li>
          <li className="hover:text-blue-300 cursor-pointer">About</li>
          <li className="hover:text-blue-300 cursor-pointer">Services</li>
          <li className="hover:text-blue-300 cursor-pointer">Contact</li>
        </ul>
      </div>
    </nav>
  );
};

export default GlassNavbar;
