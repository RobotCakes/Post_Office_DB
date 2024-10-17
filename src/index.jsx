import RoutesPage from "./routes";

const Index = () => {
  return (
    <>
      <AuthProvider>
        <RoutesPage />
      </AuthProvider>
    </>
  );
};

export default Index;