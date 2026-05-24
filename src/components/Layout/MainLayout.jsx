import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      
      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
